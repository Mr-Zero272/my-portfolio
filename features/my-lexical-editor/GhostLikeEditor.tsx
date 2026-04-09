import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState } from 'lexical';
import { debounce } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

import { HorizontalRuleExtension } from '@lexical/extension';
import { HistoryExtension } from '@lexical/history';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { RichTextExtension } from '@lexical/rich-text';
import { defineExtension } from 'lexical';
import TableCellResizer from './plugins/TableCellResizer';

import PlaygroundNodes from './nodes/PlaygroundNodes';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import DateTimePlugin from './plugins/DateTimePlugin';
import DraggableBlockPlugin from './plugins/draggable-block-plugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import { ImagesExtension } from './plugins/ImagesExtension';
import ImagesPlugin from './plugins/ImagesPlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
// import './themes/PlaygroundEditorTheme.css';
import ContentEditable from './ui/ContentEditable';

const ghostEditorExtension = defineExtension({
  namespace: 'GhostLikeEditor',
  nodes: [...PlaygroundNodes],
  theme: PlaygroundEditorTheme,
  onError: (error: Error) => {
    console.error('[GhostLikeEditor]', error);
  },
  dependencies: [
    RichTextExtension,
    HistoryExtension,
    ListExtension,
    CheckListExtension,
    HorizontalRuleExtension,
    ImagesExtension,
  ],
  name: 'GhostLikeEditor',
});

function InitializeContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Nếu có nội dung và chưa được init (hoặc nội dung không phải là rỗng mặc định của Lexical)
    // thì ta tiến hành update editor state lần đầu.
    if (content && !isInitialized.current) {
      editor.update(() => {
        try {
          const initialEditorState = editor.parseEditorState(content);
          editor.setEditorState(initialEditorState);
          isInitialized.current = true;
        } catch (e) {
          console.error('[GhostLikeEditor] Failed to parse initial content', e);
        }
      });
    }
  }, [content, editor]);

  return null;
}

function DebouncedOnChangePlugin({ onChange }: { onChange?: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  const debouncedOnChange = useMemo(() => {
    return debounce((editorState: EditorState) => {
      const jsonString = JSON.stringify(editorState.toJSON());
      onChange?.(jsonString);
    }, 1000); // Đồng bộ sau 1s khi người dùng dừng gõ
  }, [onChange]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      // Chỉ sync nếu có thay đổi thực sự trong editor
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
      debouncedOnChange(editorState);
    });
  }, [editor, debouncedOnChange]);

  return null;
}

function GhostLikeEditorInner({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}): JSX.Element {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [, setIsLinkEditMode] = useState<boolean>(false);

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = window.matchMedia('(max-width: 1025px)').matches;
      setIsSmallWidthViewport(isNextSmallWidthViewport);
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);
    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, []);

  return (
    <div className="editor-container">
      <ComponentPickerPlugin />
      <TablePlugin />
      <CollapsiblePlugin />
      <ImagesPlugin />
      <DateTimePlugin />
      <TableCellResizer />
      <LinkPlugin />
      <InitializeContentPlugin content={content} />
      <DebouncedOnChangePlugin onChange={onChange} />
      <div className="editor-scroller">
        <div
          className="editor"
          ref={(elem) => {
            if (elem) setFloatingAnchorElem(elem);
          }}
        >
          <ContentEditable placeholder="Enter some rich text..." />
        </div>
      </div>
      {floatingAnchorElem && !isSmallWidthViewport && (
        <>
          <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
          <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={setIsLinkEditMode} />
        </>
      )}
    </div>
  );
}

export default function GhostLikeEditor({
  content,
  onChange,
}: {
  content?: string;
  onChange?: (content: string) => void;
}): JSX.Element {
  return (
    <LexicalExtensionComposer extension={ghostEditorExtension} contentEditable={null}>
      <GhostLikeEditorInner content={content} onChange={onChange} />
    </LexicalExtensionComposer>
  );
}
