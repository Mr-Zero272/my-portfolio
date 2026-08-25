// RichTextEditor.tsx
import { cn } from '@/lib/utils';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  $isListItemNode,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $createParagraphNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  createEditor,
  EditorState,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from 'lexical';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toggle } from './toggle';

interface RichTextEditorProps {
  id?: string;
  value?: string;
  onChange?: (jsonString: string, htmlString: string) => void;
  placeholder?: string;
  initialValue?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;
  className?: string;
}

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  heading: {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
  },
  list: {
    ul: 'list-disc pl-5 mb-2',
    ol: 'list-decimal pl-5 mb-2',
    listitem: 'mb-1',
  },
  quote: 'border-l-4 border-gray-300 pl-4 italic my-2',
  link: 'text-blue-500 underline cursor-pointer',
};

function onError(error: Error) {
  console.error('Lexical Error:', error);
}

export const lexicalJsonToHtml = (json: string) => {
  const editor = createEditor({
    namespace: 'ContentRenderer',
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  });

  const editorState = editor.parseEditorState(json);

  let html = '';

  editorState.read(() => {
    html = $generateHtmlFromNodes(editor);
  });

  return html;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  'aria-invalid': ariaInvalid,
  className,
}: RichTextEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: 'MyRichTextEditor',
    theme,
    onError,
    editable: !disabled,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        aria-invalid={ariaInvalid}
        className={cn(
          'border-input focus-within:border-ring focus-within:ring-ring/50 dark:bg-input/30 w-full min-w-0 rounded-lg border bg-transparent text-base transition-colors outline-none focus-within:ring-3 md:text-sm',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 aria-invalid:ring-3',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <ToolbarPlugin />
        <div className="relative min-h-32 px-2.5 py-2">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn('min-h-12 outline-none', disabled && 'cursor-not-allowed')}
                aria-placeholder={placeholder}
                aria-invalid={ariaInvalid}
                placeholder={
                  <div className="text-muted-foreground pointer-events-none absolute top-3 left-3 select-none">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
      <InitializeContentPlugin content={value} />
      {onChange && <CustomOnChangePlugin onChange={onChange} />}
      <AutoFocusPlugin />
      <ListPlugin />
    </LexicalComposer>
  );
}

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

const CustomOnChangePlugin = ({
  onChange,
}: {
  onChange: (jsonString: string, htmlString: string) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const debouncedOnChange = useMemo(
    () => (editorState: EditorState) => {
      editor.read(() => {
        const jsonString = JSON.stringify(editorState.toJSON());
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange?.(jsonString, htmlString);
      });
    },
    [onChange, editor],
  );
  return <OnChangePlugin onChange={(editorState) => debouncedOnChange(editorState)} />;
};

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote';

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeBlock, setActiveBlock] = useState<BlockType>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<ElementFormatType>('left');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }

    // Trạng thái text format
    const textFormat = selection.format;
    setIsBold((textFormat & 1) === 1);
    setIsItalic((textFormat & 2) === 2);
    setIsUnderline((textFormat & 8) === 8);

    // Trạng thái block type + alignment
    const anchorNode = selection.anchor.getNode();
    const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElement();
    if (!element || !$isElementNode(element)) {
      return;
    }

    const format = element.getFormatType();
    setAlignment(format === '' ? 'left' : format);

    if ($isListNode(element)) {
      setActiveBlock(element.getTag() === 'ul' ? 'ul' : 'ol');
    } else if ($isListItemNode(element)) {
      const parent = element.getParent();
      setActiveBlock($isListNode(parent) ? (parent.getTag() === 'ul' ? 'ul' : 'ol') : 'paragraph');
    } else if ($isHeadingNode(element)) {
      const tag = element.getTag();
      setActiveBlock(tag === 'h1' || tag === 'h2' || tag === 'h3' ? tag : 'paragraph');
    } else if ($isQuoteNode(element)) {
      setActiveBlock('quote');
    } else {
      setActiveBlock('paragraph');
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (activeBlock === headingSize) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      }
    });
    editor.focus();
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (activeBlock === 'quote') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
    editor.focus();
  };

  const toggleList = (ordered: boolean) => {
    if (activeBlock === (ordered ? 'ol' : 'ul')) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(
        ordered ? INSERT_ORDERED_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
        undefined,
      );
    }
    editor.focus();
  };

  const formatElement = (type: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
    editor.focus();
  };

  const divider = <div className="bg-border mx-1 h-6 w-px" />;

  return (
    <div className="border-input bg-muted/40 flex flex-wrap items-center gap-1 border-b p-1.5">
      {/* Undo/Redo */}
      <Toggle
        aria-label="Undo"
        title="Undo (Ctrl+Z)"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 />
      </Toggle>
      <Toggle
        aria-label="Redo"
        title="Redo (Ctrl+Y)"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 />
      </Toggle>

      {divider}

      {/* Text formatting */}
      <Toggle
        pressed={isBold}
        onPressedChange={() => formatText('bold')}
        aria-label="Bold"
        title="Bold (Ctrl+B)"
      >
        <Bold />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={() => formatText('italic')}
        aria-label="Italic"
        title="Italic (Ctrl+I)"
      >
        <Italic />
      </Toggle>
      <Toggle
        pressed={isUnderline}
        onPressedChange={() => formatText('underline')}
        aria-label="Underline"
        title="Underline (Ctrl+U)"
      >
        <Underline />
      </Toggle>
      <Toggle
        aria-label="Strikethrough"
        title="Strikethrough (Ctrl+K)"
        onClick={() => formatText('strikethrough')}
      >
        <Strikethrough />
      </Toggle>

      {divider}

      {/* Block formatting */}
      <Toggle
        pressed={activeBlock === 'h1'}
        onPressedChange={() => formatHeading('h1')}
        aria-label="Heading 1"
        title="Heading 1"
      >
        <Heading1 />
      </Toggle>
      <Toggle
        pressed={activeBlock === 'h2'}
        onPressedChange={() => formatHeading('h2')}
        aria-label="Heading 2"
        title="Heading 2"
      >
        <Heading2 />
      </Toggle>
      <Toggle
        pressed={activeBlock === 'h3'}
        onPressedChange={() => formatHeading('h3')}
        aria-label="Heading 3"
        title="Heading 3"
      >
        <Heading3 />
      </Toggle>

      {divider}

      {/* Lists */}
      <Toggle
        pressed={activeBlock === 'ul'}
        onPressedChange={() => toggleList(false)}
        aria-label="Bulleted list"
        title="Bulleted list"
      >
        <List />
      </Toggle>
      <Toggle
        pressed={activeBlock === 'ol'}
        onPressedChange={() => toggleList(true)}
        aria-label="Ordered list"
        title="Ordered list"
      >
        <ListOrdered />
      </Toggle>

      {/* Quote */}
      <Toggle
        pressed={activeBlock === 'quote'}
        onPressedChange={formatQuote}
        aria-label="Quote"
        title="Quote"
      >
        <Quote />
      </Toggle>

      {divider}

      {/* Alignment */}
      <Toggle
        pressed={alignment === 'left'}
        onPressedChange={() => formatElement('left')}
        aria-label="Left align"
        title="Left align"
      >
        <AlignLeft />
      </Toggle>
      <Toggle
        pressed={alignment === 'center'}
        onPressedChange={() => formatElement('center')}
        aria-label="Center align"
        title="Center align"
      >
        <AlignCenter />
      </Toggle>
      <Toggle
        pressed={alignment === 'right'}
        onPressedChange={() => formatElement('right')}
        aria-label="Right align"
        title="Right align"
      >
        <AlignRight />
      </Toggle>
      <Toggle
        pressed={alignment === 'justify'}
        onPressedChange={() => formatElement('justify')}
        aria-label="Justify"
        title="Justify"
      >
        <AlignJustify />
      </Toggle>
    </div>
  );
};
