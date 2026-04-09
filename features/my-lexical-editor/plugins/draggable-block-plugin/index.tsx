/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { NodeKey } from 'lexical';
import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $isParagraphNode,
  $isTextNode,
} from 'lexical';
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Plus } from 'lucide-react';
import useModal from '../../hooks/useModal';
import {
  ComponentPickerMenuItem,
  ComponentPickerOption,
  getBaseOptions,
  getDynamicOptions,
} from '../ComponentPickerPlugin';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

type PickerState = {
  insertBefore: boolean;
  targetNodeKey: NodeKey;
};

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();
  const menuRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(null);
  const [pickerState, setPickerState] = useState<PickerState | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [queryString, setQueryString] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [pickerPosition, setPickerPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, showModal);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');
    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) => regex.test(option.title) || option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString, showModal]);

  useEffect(() => {
    if (isPickerOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isPickerOpen]);

  const setHighlightedIndexEffect = useEffectEvent(() => {
    if (!isPickerOpen || !options.length) {
      return;
    }
    setHighlightedIndex((current) => Math.min(current, Math.max(options.length - 1, 0)));
  });

  useEffect(() => {
    setHighlightedIndexEffect();
  }, [isPickerOpen, options.length]);

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        (pickerRef.current && pickerRef.current.contains(target)) ||
        (menuRef.current && menuRef.current.contains(target))
      ) {
        return;
      }
      setIsPickerOpen(false);
      setPickerState(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPickerOpen]);

  const selectOption = useCallback(
    (option: ComponentPickerOption) => {
      if (!pickerState) {
        setIsPickerOpen(false);
        return;
      }
      setIsPickerOpen(false);
      editor.update(() => {
        const node = $getNodeByKey(pickerState.targetNodeKey);
        if (!node) {
          return;
        }
        const placeholder = $createParagraphNode();
        const textNode = $createTextNode('');
        placeholder.append(textNode);
        if (pickerState.insertBefore) {
          node.insertBefore(placeholder);
        } else {
          node.insertAfter(placeholder);
        }
        textNode.select();
        option.onSelect(queryString);
        const latestPlaceholder = placeholder.getLatest();
        if ($isParagraphNode(latestPlaceholder)) {
          const onlyChild = latestPlaceholder.getFirstChild();
          if (
            $isTextNode(onlyChild) &&
            onlyChild.getTextContent().length === 0 &&
            latestPlaceholder.getChildrenSize() === 1
          ) {
            latestPlaceholder.remove();
          }
        }
      });
    },
    [editor, pickerState, queryString],
  );

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPickerOpen || !options.length) {
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((index) => (index + 1 >= options.length ? 0 : index + 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((index) => (index - 1 < 0 ? options.length - 1 : index - 1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const option = options[highlightedIndex];
        if (option) {
          selectOption(option);
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setIsPickerOpen(false);
        setPickerState(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [highlightedIndex, isPickerOpen, options, selectOption]);

  function openComponentPicker(e: React.MouseEvent) {
    if (!draggableElement || !editor) {
      return;
    }

    let targetNodeKey: NodeKey | null = null;
    editor.read(() => {
      const resolvedNode = $getNearestNodeFromDOMNode(draggableElement);
      if (resolvedNode) {
        targetNodeKey = resolvedNode.getKey();
      }
    });

    if (!targetNodeKey) {
      return;
    }

    const insertBefore = e.altKey || e.ctrlKey;
    const rect = menuRef.current?.getBoundingClientRect();
    setPickerPosition(
      rect
        ? {
            left: rect.left + rect.width + window.scrollX + 8,
            top: rect.top + window.scrollY,
          }
        : null,
    );
    setPickerState({ insertBefore, targetNodeKey });
    setQueryString('');
    setHighlightedIndex(0);
    setIsPickerOpen(true);
  }

  return (
    <>
      {modal}
      {isPickerOpen && pickerPosition
        ? ReactDOM.createPortal(
            <div
              className="flex max-w-70 flex-col overflow-hidden rounded-lg border bg-white shadow-md dark:bg-zinc-900"
              ref={pickerRef}
              style={{
                left: pickerPosition.left,
                position: 'absolute',
                top: pickerPosition.top,
                zIndex: 10,
              }}
            >
              <Input
                className="rounded-t-lg rounded-b-none border-0 border-b px-2.5 text-sm focus-visible:ring-0"
                placeholder="Filter blocks..."
                value={queryString}
                ref={searchInputRef}
                onChange={(event) => setQueryString(event.target.value)}
              />
              <ScrollArea className="max-h-72 flex-1 overflow-y-auto">
                <ul>
                  {options.map((option, i: number) => (
                    <ComponentPickerMenuItem
                      index={i}
                      isSelected={highlightedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOption(option);
                      }}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </ScrollArea>
            </div>,
            document.body,
          )
        : null}
      <DraggableBlockPlugin_EXPERIMENTAL
        anchorElem={anchorElem}
        menuRef={menuRef}
        targetLineRef={targetLineRef}
        menuComponent={
          <div
            ref={menuRef}
            className="draggable-block-menu absolute top-0 left-0 flex cursor-grab gap-0.5 rounded px-px py-0.5 opacity-0 will-change-[transform,opacity] [transition:transform_140ms_ease-in-out,opacity_160ms_ease-in-out] active:cursor-grabbing"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Click to add below"
              className="size-4 p-0 hover:bg-[#efefef]"
              onClick={openComponentPicker}
            >
              <Plus className="size-4" />
            </Button>
            <div className="flex size-4 items-center justify-center opacity-30 hover:bg-[#efefef]">
              <GripVertical className="size-4" />
            </div>
          </div>
        }
        targetLineComponent={
          <div
            ref={targetLineRef}
            className="pointer-events-none absolute top-0 left-0 h-1 bg-[deepskyblue] opacity-0 will-change-transform"
          />
        }
        isOnMenu={isOnMenu}
        onElementChanged={setDraggableElement}
      />
    </>
  );
}
