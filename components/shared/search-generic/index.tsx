import * as Portal from '@radix-ui/react-portal';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, XIcon } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface SearchGenericProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  data: T[];
  onSelect: (item: T) => void;
  renderResultItem: (item: T, index: number) => ReactNode;
  placeholder?: string;
  emptyStateMessage?: string;
  noResultsMessage?: string;
  searchKeys?: (keyof T)[];
  maxResults?: number;
  className?: string;
  searchInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

interface DefaultSearchItem {
  id: string | number;
  title: string;
  content?: string;
  type?: string;
}

const SearchGeneric = <T extends DefaultSearchItem>({
  isOpen,
  onOpenChange,
  value,
  onValueChange,
  data,
  onSelect,
  renderResultItem,
  placeholder = 'Search...',
  emptyStateMessage = 'Start typing to see results',
  noResultsMessage = 'No results found',
  searchKeys = ['title' as keyof T, 'content' as keyof T],
  maxResults = 10,
  className = '',
  searchInputProps = {},
}: SearchGenericProps<T>) => {
  const [results, setResults] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulate search functionality
  useEffect(() => {
    if (value.trim()) {
      const filtered = data.filter((item) => {
        return searchKeys.some((key) => {
          const fieldValue = item[key];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(value.toLowerCase());
          }
          return false;
        });
      });
      setResults(filtered.slice(0, maxResults));
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [value, data, searchKeys, maxResults]);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultSelect = useCallback(
    (result: T) => {
      onSelect(result);
      onOpenChange(false);
      onValueChange('');
      setResults([]);
    },
    [onSelect, onOpenChange, onValueChange],
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        onValueChange('');
        setResults([]);
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        handleResultSelect(results[selectedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onOpenChange, onValueChange, handleResultSelect]);

  return (
    <Portal.Root>
      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-opacity-50 fixed inset-0 z-[99998] bg-white/30 backdrop-blur-xs dark:bg-black/30"
              onClick={() => onOpenChange(false)}
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`fixed top-20 left-1/2 z-[99999] w-full max-w-2xl -translate-x-1/2 transform px-4 ${className}`}
            >
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                {/* Search Input */}
                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <Search className="text-muted-foreground h-5 w-5" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onValueChange(e.target.value)}
                      className="flex-1 border-none bg-transparent text-lg placeholder-gray-500 outline-none"
                      {...searchInputProps}
                    />
                    {value && <XIcon className="size-4" onClick={() => onValueChange('')} />}
                    <div className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
                      <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-semibold">
                        Enter
                      </kbd>
                      <span>to select</span>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-h-96 overflow-y-auto"
                    >
                      {results.map((result, index) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultSelect(result)}
                          className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 focus:outline-none ${
                            index === selectedIndex
                              ? 'bg-blue-50 hover:bg-blue-50'
                              : 'hover:bg-gray-50 focus:bg-gray-50'
                          }`}
                        >
                          {renderResultItem(result, index)}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No results */}
                {value && results.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="mb-2 text-gray-400">
                      <Search className="mx-auto h-8 w-8" />
                    </div>
                    <p className="text-gray-500">
                      {noResultsMessage} &ldquo;{value}&rdquo;
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {!value && (
                  <div className="p-8 text-center">
                    <div className="mb-4 text-gray-400">
                      <Search className="mx-auto h-8 w-8" />
                    </div>
                    <p className="mb-2 text-gray-500">Search</p>
                    <p className="text-sm text-gray-400">{emptyStateMessage}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5">↑↓</kbd>
                        navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5">Enter</kbd>
                        select
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5">Esc</kbd>
                      close
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  );
};

export default SearchGeneric;
