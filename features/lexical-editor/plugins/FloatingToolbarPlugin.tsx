'use client';

import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Bold, Code2, Heading1, Heading2, Italic, Quote, Strikethrough, Underline } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ─── Active format state ──────────────────────────────────────────────────────

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  code: boolean;
  blockType: string;
}

function getFormatState(): FormatState {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return { bold: false, italic: false, underline: false, strikethrough: false, code: false, blockType: 'paragraph' };
  }

  const anchorNode = selection.anchor.getNode();
  const topElement = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

  const blockType = $isHeadingNode(topElement) ? topElement.getTag() : topElement.getType();

  return {
    bold: selection.hasFormat('bold'),
    italic: selection.hasFormat('italic'),
    underline: selection.hasFormat('underline'),
    strikethrough: selection.hasFormat('strikethrough'),
    code: selection.hasFormat('code'),
    blockType,
  };
}

// ─── Toolbar buttons config ───────────────────────────────────────────────────

const TEXT_BUTTONS = [
  { format: 'bold' as const, icon: <Bold size={14} />, title: 'Bold (Ctrl+B)' },
  { format: 'italic' as const, icon: <Italic size={14} />, title: 'Italic (Ctrl+I)' },
  { format: 'underline' as const, icon: <Underline size={14} />, title: 'Underline (Ctrl+U)' },
  { format: 'strikethrough' as const, icon: <Strikethrough size={14} />, title: 'Strikethrough' },
  { format: 'code' as const, icon: <Code2 size={14} />, title: 'Inline code' },
];

// ─── FloatingToolbar UI ───────────────────────────────────────────────────────

interface FloatingToolbarProps {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  anchorEl: Range;
  formatState: FormatState;
  onClose: () => void;
}

function FloatingToolbarUI({ editor, anchorEl, formatState, onClose }: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Compute position with @floating-ui/dom
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    // Use the selection range as the reference element
    const virtualRef = {
      getBoundingClientRect: () => anchorEl.getBoundingClientRect(),
    };

    computePosition(virtualRef as Element, toolbar, {
      placement: 'top',
      middleware: [offset(8), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      toolbar.style.left = `${x}px`;
      toolbar.style.top = `${y}px`;
    });
  }, [anchorEl]);

  // Close on outside mousedown
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onClose]);

  function dispatchFormat(format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }

  function setBlockType(type: 'h1' | 'h2' | 'paragraph' | 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      if (type === 'paragraph') {
        $setBlocksType(selection, () => $createParagraphNode());
      } else if (type === 'quote') {
        $setBlocksType(selection, () => $createQuoteNode());
      } else {
        $setBlocksType(selection, () => $createHeadingNode(type));
      }
    });
  }

  return (
    <div
      ref={toolbarRef}
      className="lex-floating-toolbar"
      style={{ position: 'fixed' }}
      onMouseDown={(e) => e.preventDefault()} // prevent selection loss
    >
      {/* Text format buttons */}
      {TEXT_BUTTONS.map(({ format, icon, title }) => (
        <button
          key={format}
          className={`lex-toolbar-btn ${formatState[format] ? 'active' : ''}`}
          title={title}
          onClick={() => dispatchFormat(format)}
        >
          {icon}
        </button>
      ))}

      <div className="lex-toolbar-divider" />

      {/* Block type buttons */}
      <button
        className={`lex-toolbar-btn ${formatState.blockType === 'h1' ? 'active' : ''}`}
        title="Heading 1"
        onClick={() => setBlockType('h1')}
      >
        <Heading1 size={14} />
      </button>
      <button
        className={`lex-toolbar-btn ${formatState.blockType === 'h2' ? 'active' : ''}`}
        title="Heading 2"
        onClick={() => setBlockType('h2')}
      >
        <Heading2 size={14} />
      </button>
      <button
        className={`lex-toolbar-btn ${formatState.blockType === 'quote' ? 'active' : ''}`}
        title="Quote"
        onClick={() => setBlockType('quote')}
      >
        <Quote size={14} />
      </button>
    </div>
  );
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, setToolbarState] = useState<{
    range: Range;
    formatState: FormatState;
  } | null>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      setToolbarState(null);
      return;
    }

    // Get the native DOM selection range
    const nativeSelection = window.getSelection();
    if (!nativeSelection || nativeSelection.rangeCount === 0) {
      setToolbarState(null);
      return;
    }

    const range = nativeSelection.getRangeAt(0);
    const rootEl = editor.getRootElement();
    if (!rootEl || !rootEl.contains(range.commonAncestorContainer)) {
      setToolbarState(null);
      return;
    }

    setToolbarState({
      range,
      formatState: getFormatState(),
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
    );
  }, [editor, updateToolbar]);

  if (!toolbarState || typeof window === 'undefined') return null;

  return createPortal(
    <FloatingToolbarUI
      editor={editor}
      anchorEl={toolbarState.range}
      formatState={toolbarState.formatState}
      onClose={() => setToolbarState(null)}
    />,
    document.body,
  );
}
