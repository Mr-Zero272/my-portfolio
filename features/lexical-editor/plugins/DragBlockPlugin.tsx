'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeFromDOMNode, $getNodeByKey, COMMAND_PRIORITY_HIGH, DROP_COMMAND } from 'lexical';
import { GripVertical, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { OPEN_BLOCK_MENU_COMMAND } from './BlockMenuPlugin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBlockElement(rootEl: HTMLElement, event: MouseEvent): HTMLElement | null {
  const target = event.target as HTMLElement;
  const node: HTMLElement | null = target.closest(
    '.lex-p, .lex-h1, .lex-h2, .lex-h3, .lex-quote, .lex-ul, .lex-ol, .lex-code, .lex-image-figure, [class^="lex-"], hr',
  );
  if (!node || !rootEl.contains(node)) return null;
  // Walk up: don't pick list items directly — pick the nearest block
  return node;
}

// ─── DragBlockPlugin ──────────────────────────────────────────────────────────

export function DragBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleRef = useRef<HTMLDivElement>(null);
  const [hoveredBlock, setHoveredBlock] = useState<HTMLElement | null>(null);
  const [handlePos, setHandlePos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const [dragging, setDragging] = useState(false);
  const dragNodeKeyRef = useRef<string | null>(null);

  // ─── Mouse tracking ───────────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rootEl = editor.getRootElement();
      if (!rootEl) return;

      const block = getBlockElement(rootEl, e);
      if (!block || block === hoveredBlock) return;

      setHoveredBlock(block);
      const rect = block.getBoundingClientRect();
      // Position handle to the left of the block
      setHandlePos({
        top: rect.top + window.scrollY + rect.height / 2 - 12,
        left: rect.left + window.scrollX - 56,
      });
    },
    [editor, hoveredBlock],
  );

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (handleRef.current?.contains(e.relatedTarget as Node)) return;
    setHoveredBlock(null);
  }, []);

  useEffect(() => {
    const rootEl = editor.getRootElement();
    if (!rootEl) return;
    rootEl.addEventListener('mousemove', handleMouseMove);
    rootEl.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      rootEl.removeEventListener('mousemove', handleMouseMove);
      rootEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [editor, handleMouseMove, handleMouseLeave]);

  // ─── "+" button click → open BlockMenu ───────────────────────────────────

  const handleAddClick = useCallback(() => {
    if (!hoveredBlock) return;
    const rect = hoveredBlock.getBoundingClientRect();
    editor.dispatchCommand(OPEN_BLOCK_MENU_COMMAND, { anchorRect: rect });
  }, [editor, hoveredBlock]);

  // ─── Drag logic ───────────────────────────────────────────────────────────

  function onDragStart(e: React.DragEvent) {
    if (!hoveredBlock) return;
    setDragging(true);

    editor.getEditorState().read(() => {
      const node = $getNearestNodeFromDOMNode(hoveredBlock);
      if (node) {
        dragNodeKeyRef.current = node.getKey();
      }
    });

    // Ghost image
    const ghost = hoveredBlock.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.top = '-9999px';
    ghost.style.opacity = '0.7';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);

    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragEnd() {
    setDragging(false);
    dragNodeKeyRef.current = null;
  }

  // Register DROP handler in editor
  useEffect(() => {
    return editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const draggedKey = dragNodeKeyRef.current;
        if (!draggedKey) return false;

        const rootEl = editor.getRootElement();
        if (!rootEl) return false;

        const dropTarget = (event as DragEvent).target as HTMLElement;
        const dropBlock = getBlockElement(rootEl, event as MouseEvent);
        if (!dropBlock) return false;

        editor.update(() => {
          const draggedNode = $getNodeByKey(draggedKey);
          const dropNode = $getNearestNodeFromDOMNode(dropBlock);
          if (!draggedNode || !dropNode || draggedNode === dropNode) return;

          const rect = dropBlock.getBoundingClientRect();
          const isAboveHalf = (event as DragEvent).clientY < rect.top + rect.height / 2;
          if (isAboveHalf) {
            dropNode.insertBefore(draggedNode);
          } else {
            dropNode.insertAfter(draggedNode);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor]);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (typeof window === 'undefined') return null;

  const visible = !!hoveredBlock;

  return createPortal(
    <div
      ref={handleRef}
      className={`lex-block-controls ${visible ? 'visible' : ''}`}
      style={{
        position: 'absolute',
        top: handlePos.top,
        left: handlePos.left,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 40,
      }}
      onMouseEnter={() => {
        /* keep visible while hovering handle */
      }}
      onMouseLeave={() => setHoveredBlock(null)}
    >
      {/* "+" add button */}
      <button
        className="lex-add-btn"
        title="Add block"
        onMouseDown={(e) => {
          e.preventDefault();
          handleAddClick();
        }}
      >
        <Plus size={14} />
      </button>

      {/* Drag handle */}
      <div
        className="lex-drag-btn"
        title="Drag to reorder"
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={{ opacity: dragging ? 0.4 : 1 }}
      >
        <GripVertical size={14} />
      </div>
    </div>,
    document.body,
  );
}
