'use client';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { useEffect, useRef } from 'react';

import { ImageNode } from './nodes/ImageNode';
import { BlockMenuPlugin } from './plugins/BlockMenuPlugin';
import { DragBlockPlugin } from './plugins/DragBlockPlugin';
import { FloatingToolbarPlugin } from './plugins/FloatingToolbarPlugin';
import { HtmlOnChangePlugin } from './plugins/OnChangePlugin';
import { SlashCommandPlugin } from './plugins/SlashCommandPlugin';
import theme from './theme';

import './LexicalEditor.css';

// ─── Nodes registered globally ────────────────────────────────────────────────

const NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  HorizontalRuleNode,
  ImageNode,
];

// ─── InitialHtml loader (inner plugin) ───────────────────────────────────────

function InitialHtmlPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !html) return;
    loaded.current = true;

    // Import lazily to keep the initial bundle small
    import('./utils/deserialize').then(({ deserializeFromHtml }) => {
      deserializeFromHtml(editor, html);
    });
  }, [editor, html]);

  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface LexicalEditorProps {
  /** Initial HTML content (edit mode). Leave undefined for create mode. */
  initialHtml?: string;
  /** Called on every debounced editor change with the serialized HTML. */
  onChange?: (html: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Extra className on the editor shell */
  className?: string;
}

// ─── Editor shell ─────────────────────────────────────────────────────────────

export default function LexicalEditor({
  initialHtml = '',
  onChange,
  placeholder = "Type '/' for commands or start writing…",
  className = '',
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    nodes: NODES,
    onError(error: Error) {
      console.error('[LexicalEditor]', error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* ─ Core plugins ──────────────────────────────── */}
      <RichTextPlugin
        contentEditable={
          <div className={`lex-editor-shell relative ${className}`} style={{ position: 'relative' }}>
            <ContentEditable className="lex-root min-h-[200px] focus:outline-none" aria-label="Rich text editor" />
          </div>
        }
        placeholder={
          <div className="lex-placeholder pointer-events-none text-muted-foreground select-none">{placeholder}</div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />

      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <TabIndentationPlugin />

      {/* ─ Feature plugins ───────────────────────────── */}
      <DragBlockPlugin />
      <FloatingToolbarPlugin />
      <SlashCommandPlugin />
      <BlockMenuPlugin />

      {/* ─ Data plugins ──────────────────────────────── */}
      {initialHtml && <InitialHtmlPlugin html={initialHtml} />}
      {onChange && <HtmlOnChangePlugin onChange={onChange} />}
    </LexicalComposer>
  );
}
