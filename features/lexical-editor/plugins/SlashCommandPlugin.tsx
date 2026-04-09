'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createParagraphNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import * as React from 'react';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';

import { getBlockItems, insertBlockById } from '../components/BlockMenu';

// ─── Option wrapper ───────────────────────────────────────────────────────────

class SlashOption extends MenuOption {
  id: string;
  name: string;
  desc: string;
  icon?: React.JSX.Element;
  blockIcon: React.ReactNode;
  keywords: string[];
  group: string;

  constructor(item: ReturnType<typeof getBlockItems>[number]) {
    super(item.id);
    this.id = item.id;
    this.name = item.name;
    this.desc = item.desc;
    this.blockIcon = item.icon;
    this.keywords = item.keywords;
    this.group = item.group;
  }
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();

  const checkForSlash = useBasicTypeaheadTriggerMatch('/', { minLength: 0 });

  // Build option list from shared block items
  const options = getBlockItems().map((item) => new SlashOption(item));

  const onSelectOption = useCallback(
    (selectedOption: SlashOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        // Remove the "/" trigger text node
        if (nodeToReplace) {
          nodeToReplace.remove();
        }

        // Insert a fresh paragraph first so the selection is valid
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Replace current empty node with a paragraph to anchor on
          const para = $createParagraphNode();
          selection.insertNodes([para]);
          para.select();
        }
      });

      // Then execute the block insertion (it reads fresh selection)
      insertBlockById(selectedOption.id, editor);
      closeMenu();
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashOption>
      onQueryChange={() => {}}
      onSelectOption={onSelectOption}
      triggerFn={checkForSlash}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        if (!anchorElementRef.current) return null;

        // Group by group label
        const groups = options.reduce<Record<string, SlashOption[]>>((acc, opt) => {
          if (!acc[opt.group]) acc[opt.group] = [];
          acc[opt.group].push(opt);
          return acc;
        }, {});

        const anchorRect = anchorElementRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - anchorRect.bottom;
        const menuHeight = 320;
        const top = spaceBelow > menuHeight ? anchorRect.bottom + 4 : anchorRect.top - menuHeight - 4;
        const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 296));

        let flatIdx = 0;

        return createPortal(
          <div className="lex-block-menu" style={{ position: 'fixed', top, left, zIndex: 60 }}>
            <div className="lex-block-menu-list">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group}>
                  <div className="lex-block-menu-group-label">{group}</div>
                  {items.map((opt) => {
                    const idx = flatIdx++;
                    return (
                      <div
                        key={opt.id}
                        ref={opt.setRefElement}
                        className={`lex-block-menu-item ${idx === selectedIndex ? 'selected' : ''}`}
                        tabIndex={-1}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => selectOptionAndCleanUp(opt)}
                      >
                        <div className="lex-block-menu-item-icon">{opt.blockIcon}</div>
                        <div className="lex-block-menu-item-info">
                          <span className="lex-block-menu-item-name">{opt.name}</span>
                          <span className="lex-block-menu-item-desc">{opt.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        );
      }}
    />
  );
}
