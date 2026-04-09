'use client';

import { $createCodeNode } from '@lexical/code';
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import { Code2, Heading1, Heading2, Heading3, List, ListChecks, ListOrdered, Minus, Quote, Type } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ─── Block item definitions ───────────────────────────────────────────────────

export interface BlockItem {
  id: string;
  group: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  keywords: string[];
}

const BLOCK_ITEMS: BlockItem[] = [
  // Text
  {
    id: 'paragraph',
    group: 'Text',
    name: 'Paragraph',
    desc: 'Plain text',
    icon: <Type size={14} />,
    keywords: ['p', 'text', 'paragraph'],
  },
  {
    id: 'h1',
    group: 'Text',
    name: 'Heading 1',
    desc: 'Large section heading',
    icon: <Heading1 size={14} />,
    keywords: ['h1', 'heading', 'title'],
  },
  {
    id: 'h2',
    group: 'Text',
    name: 'Heading 2',
    desc: 'Medium section heading',
    icon: <Heading2 size={14} />,
    keywords: ['h2', 'heading', 'subtitle'],
  },
  {
    id: 'h3',
    group: 'Text',
    name: 'Heading 3',
    desc: 'Small section heading',
    icon: <Heading3 size={14} />,
    keywords: ['h3', 'heading'],
  },
  {
    id: 'quote',
    group: 'Text',
    name: 'Quote',
    desc: 'Highlighted callout text',
    icon: <Quote size={14} />,
    keywords: ['quote', 'blockquote'],
  },
  // Lists
  {
    id: 'ul',
    group: 'Lists',
    name: 'Bullet list',
    desc: 'Unordered list',
    icon: <List size={14} />,
    keywords: ['ul', 'bullet', 'list'],
  },
  {
    id: 'ol',
    group: 'Lists',
    name: 'Numbered list',
    desc: 'Ordered list',
    icon: <ListOrdered size={14} />,
    keywords: ['ol', 'numbered', 'list'],
  },
  {
    id: 'check',
    group: 'Lists',
    name: 'Checklist',
    desc: 'Task / todo list',
    icon: <ListChecks size={14} />,
    keywords: ['check', 'todo', 'task'],
  },
  // Media / other
  {
    id: 'code',
    group: 'Media',
    name: 'Code block',
    desc: 'Fenced code with syntax highlight',
    icon: <Code2 size={14} />,
    keywords: ['code', 'pre', 'snippet'],
  },
  {
    id: 'divider',
    group: 'Media',
    name: 'Divider',
    desc: 'Horizontal rule',
    icon: <Minus size={14} />,
    keywords: ['hr', 'divider', 'rule'],
  },
];

export function getBlockItems() {
  return BLOCK_ITEMS;
}

// ─── Insert action ─────────────────────────────────────────────────────────────

export function insertBlockById(id: string, editor: ReturnType<typeof useLexicalComposerContext>[0]): void {
  switch (id) {
    case 'paragraph':
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const paragraph = $createParagraphNode();
          selection.insertNodes([paragraph]);
        }
      });
      break;
    case 'h1':
    case 'h2':
    case 'h3':
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const level = id as 'h1' | 'h2' | 'h3';
          const heading = $createHeadingNode(level);
          selection.insertNodes([heading]);
          heading.select();
        }
      });
      break;
    case 'quote':
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const quote = $createQuoteNode();
          selection.insertNodes([quote]);
          quote.select();
        }
      });
      break;
    case 'ul':
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      break;
    case 'ol':
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      break;
    case 'check':
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      break;
    case 'code':
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const code = $createCodeNode();
          selection.insertNodes([code]);
          code.select();
        }
      });
      break;
    case 'divider':
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
      break;
  }
}

// ─── BlockMenu UI ─────────────────────────────────────────────────────────────

interface BlockMenuProps {
  /** Anchor rect to position the menu near */
  anchorRect: DOMRect | null;
  onClose: () => void;
  /** Optional initial query pre-typed (slash command) */
  initialQuery?: string;
}

export function BlockMenu({ anchorRect, onClose, initialQuery = '' }: BlockMenuProps) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter items
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return BLOCK_ITEMS;
    return BLOCK_ITEMS.filter(
      (item) => item.name.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q)),
    );
  }, [query]);

  // Keep selectedIndex in range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus search input on open
  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 0);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose]);

  const select = useCallback(
    (id: string) => {
      insertBlockById(id, editor);
      onClose();
    },
    [editor, onClose],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) select(filtered[selectedIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!anchorRect) return null;

  // Position below the anchor; flip up if near bottom of viewport
  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const menuHeight = 360;
  const top = spaceBelow > menuHeight ? anchorRect.bottom + 6 : anchorRect.top - menuHeight - 6;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 296));

  // Group items
  const groups = filtered.reduce<Record<string, BlockItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  let flatIdx = 0;

  return (
    <div ref={menuRef} className="lex-block-menu" style={{ position: 'fixed', top, left }} onKeyDown={handleKeyDown}>
      <input
        ref={searchRef}
        className="lex-block-menu-search"
        placeholder="Filter…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="lex-block-menu-list">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <div className="lex-block-menu-group-label">{group}</div>
            {items.map((item) => {
              const idx = flatIdx++;
              return (
                <div
                  key={item.id}
                  className={`lex-block-menu-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(item.id);
                  }}
                >
                  <div className="lex-block-menu-item-icon">{item.icon}</div>
                  <div className="lex-block-menu-item-info">
                    <span className="lex-block-menu-item-name">{item.name}</span>
                    <span className="lex-block-menu-item-desc">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.5, fontSize: '0.875rem' }}>No results</div>
        )}
      </div>
    </div>
  );
}
