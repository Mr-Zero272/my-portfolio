'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Spinner } from './spinner';

export interface MultiSelectProps<T extends { id: string }> {
  /** Controlled: currently selected IDs */
  value: string[];
  /** Controlled: toggle selection */
  onValueChange: (ids: string[]) => void;

  /** Search results from server (already deduped by consumer or handled internally) */
  searchResults: T[];
  /** Full objects for currently selected items (from batch fetch) */
  selectedItems: T[];
  /** Whether a search is in flight */
  isLoading?: boolean;

  /** Called (debounced) when user types in the search input */
  onSearch: (query: string) => void;
  /** Called when user wants to create a new item. Returns the created item. */
  onCreate?: (name: string) => Promise<T>;
  /** Label for the create badge, e.g. "Create label" */
  createLabel?: string;

  /** Render a search-result badge (clickable to select) */
  renderItem: (item: T) => React.ReactNode;
  /** Render a selected badge (with remove button) */
  renderBadge: (item: T, onRemove: () => void) => React.ReactNode;
  /** Extract ID from item */
  getItemId: (item: T) => string;
  /** Extract display string from item (used for create-matching) */
  itemToString: (item: T) => string;

  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect<T extends { id: string }>({
  value,
  onValueChange,
  searchResults,
  selectedItems,
  isLoading = false,
  onSearch,
  onCreate,
  createLabel = 'Create',
  renderItem,
  renderBadge,
  getItemId,
  itemToString,
  placeholder = 'Search...',
  disabled = false,
  className,
}: MultiSelectProps<T>) {
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Debounced search ──────────────────────────────────────────────
  const debouncedSearch = useDebouncedCallback((val: string) => {
    onSearch(val);
  }, 300);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      debouncedSearch(val);
    },
    [debouncedSearch],
  );

  // ── Dedup: exclude already-selected items from search results ─────
  const selectedIdSet = useMemo(() => new Set(value), [value]);

  const dedupedResults = useMemo(
    () => searchResults.filter((item) => !selectedIdSet.has(getItemId(item))),
    [searchResults, selectedIdSet, getItemId],
  );

  // ── Create match: show create badge only if input has text ────────
  const exactMatchExists = useMemo(
    () =>
      dedupedResults.some((item) => itemToString(item).toLowerCase() === inputValue.toLowerCase()),
    [dedupedResults, inputValue, itemToString],
  );

  const showCreate = !!onCreate && inputValue.trim().length > 0 && !exactMatchExists;

  // ── Selected items lookup (id → full object) ──────────────────────
  const selectedMap = useMemo(() => {
    const map = new Map<string, T>();
    for (const item of selectedItems) {
      map.set(getItemId(item), item);
    }
    return map;
  }, [selectedItems, getItemId]);

  // ── Toggle selection ──────────────────────────────────────────────
  const handleSelect = useCallback(
    (item: T) => {
      const id = getItemId(item);
      if (selectedIdSet.has(id)) {
        onValueChange(value.filter((v) => v !== id));
      } else {
        onValueChange([...value, id]);
      }
      setInputValue('');
      onSearch('');
      inputRef.current?.focus();
    },
    [value, onValueChange, selectedIdSet, getItemId, onSearch],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onValueChange(value.filter((v) => v !== id));
      inputRef.current?.focus();
    },
    [value, onValueChange],
  );

  // ── Create ────────────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    if (!onCreate || !inputValue.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const created = await onCreate(inputValue.trim());
      // Auto-select the newly created item
      onValueChange([...value, getItemId(created)]);
      setInputValue('');
      onSearch('');
    } finally {
      setIsCreating(false);
      inputRef.current?.focus();
    }
  }, [onCreate, inputValue, isCreating, value, onValueChange, getItemId, onSearch]);

  // ── Keyboard handling ─────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (showCreate) {
          handleCreate();
        } else if (dedupedResults.length > 0) {
          handleSelect(dedupedResults[0]);
        }
      }

      // Backspace on empty input → remove last selected
      if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        handleRemove(value[value.length - 1]);
      }
    },
    [showCreate, handleCreate, dedupedResults, handleSelect, inputValue, value, handleRemove],
  );

  // ── Clear search when value changes externally ────────────────────
  // useEffect(() => {
  //   setInputValue('');
  //   onSearch('');
  // }, [value.length]);

  return (
    <div className={cn('flex flex-col gap-2 pb-2', className)}>
      {/* Selected badges */}
      {value.length > 0 && (
        <div className="flex items-end gap-2">
          <span className="text-muted-foreground text-xs">Selected:</span>
          <div className="flex flex-wrap gap-1.5" role="list" aria-label="Selected items">
            {value.map((id) => {
              const item = selectedMap.get(id);
              if (!item) return null;
              return (
                <div key={id} role="listitem">
                  {renderBadge(item, () => handleRemove(id))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search results badges or create badge */}
      {(dedupedResults.length > 0 || showCreate) && (
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="list"
          aria-label="Search results"
        >
          {dedupedResults.map((item) => (
            <button
              key={getItemId(item)}
              type="button"
              role="listitem"
              onClick={() => handleSelect(item)}
              className="cursor-pointer border-none bg-transparent p-0"
            >
              {renderItem(item)}
            </button>
          ))}

          {/* Create badge */}
          {showCreate && (
            <Badge
              variant="outline"
              className="hover:bg-accent cursor-pointer gap-1 border-dashed hover:border-solid"
              onClick={handleCreate}
            >
              {isCreating ? <Spinner className="size-3" /> : <PlusIcon className="size-3" />}
              {createLabel} &quot;{inputValue.trim()}&quot;
            </Badge>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && inputValue.trim() && dedupedResults.length === 0 && !showCreate && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2Icon className="size-3.5 animate-spin" />
          Searching...
        </div>
      )}

      {/* Search input */}
      <Input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={value.length > 0 ? 'Search to add more...' : placeholder}
        disabled={disabled}
      />
    </div>
  );
}
