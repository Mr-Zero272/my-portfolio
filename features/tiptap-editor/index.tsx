import { RichTextProvider } from 'reactjs-tiptap-editor';

// Base Kit
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { ListItem } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { TextStyle } from '@tiptap/extension-text-style';
import { CharacterCount, Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions';

// Extensions
import { Attachment } from 'reactjs-tiptap-editor/attachment';
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { Bold } from 'reactjs-tiptap-editor/bold';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Callout } from 'reactjs-tiptap-editor/callout';
import { Code } from 'reactjs-tiptap-editor/code';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Color } from 'reactjs-tiptap-editor/color';
import { Column, ColumnNode, MultipleColumnNode } from 'reactjs-tiptap-editor/column';
import { Drawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji } from 'reactjs-tiptap-editor/emoji';
import { Excalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { History } from 'reactjs-tiptap-editor/history';
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe } from 'reactjs-tiptap-editor/iframe';
import { Image } from 'reactjs-tiptap-editor/image';
import { ImageGif } from 'reactjs-tiptap-editor/imagegif';
import { Indent } from 'reactjs-tiptap-editor/indent';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { Katex } from 'reactjs-tiptap-editor/katex';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import { Link } from 'reactjs-tiptap-editor/link';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { Mermaid } from 'reactjs-tiptap-editor/mermaid';
import { MoreMark } from 'reactjs-tiptap-editor/moremark';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Table } from 'reactjs-tiptap-editor/table';
import { TaskList } from 'reactjs-tiptap-editor/tasklist';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Twitter } from 'reactjs-tiptap-editor/twitter';
import { Video } from 'reactjs-tiptap-editor/video';

// Slash Command
import { SlashCommand, SlashCommandList } from 'reactjs-tiptap-editor/slashcommand';

// Bubble Menu Components
import {
  RichTextBubbleCallout,
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleImage,
  RichTextBubbleImageGif,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleMenuDragHandle,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleVideo,
} from 'reactjs-tiptap-editor/bubble';

// Styles
import '@excalidraw/excalidraw/index.css';
import 'easydrawer/styles.css';
import 'katex/contrib/mhchem';
import 'katex/dist/katex.min.css';
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'reactjs-tiptap-editor/style.css';

import { EMOJI_LIST } from '@/features/tiptap-editor/emojis';
import { uploadFile, uploadImageWithDB } from '@/lib/uploadthing';
import { EditorContent, useEditor } from '@tiptap/react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

// Utility function to convert base64 to blob
function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Custom document to support columns
const DocumentColumn = Document.extend({
  content: '(block|columns)+',
});

const MOCK_USERS = [
  {
    id: '0',
    label: 'hunghg255',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/42096908?v=4',
    },
  },
  {
    id: '1',
    label: 'benjamincanac',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4',
    },
  },
  {
    id: '2',
    label: 'atinux',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/904724?v=4',
    },
  },
  {
    id: '3',
    label: 'danielroe',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/28706372?v=4',
    },
  },
  {
    id: '4',
    label: 'pi0',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/5158436?v=4',
    },
  },
];

// Base TipTap extensions
const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor.configure({
    class: 'reactjs-tiptap-editor-theme',
    color: 'hsl(var(--primary))',
    width: 2,
  }),
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: "Press '/' for commands, or start writing...",
  }),
];

const LIMIT = 50000;

// Function to create extensions with user context
const createExtensions = (userId?: string) => [
  ...BaseKit,
  CharacterCount.configure({
    limit: LIMIT,
  }),
  History,
  SearchAndReplace,
  FontFamily,
  Heading,
  FontSize,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji.configure({
    suggestion: {
      items: async ({ query }: { query: string }) => {
        const lowerCaseQuery = query?.toLowerCase();
        return EMOJI_LIST.filter(({ name }) => name.toLowerCase().includes(lowerCaseQuery));
      },
    },
  }),
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: async (file: File) => {
      try {
        if (!userId) {
          console.warn('No user ID available, using fallback upload');
          const result = await uploadFile(file, 'imageUploader');
          return result.data.url;
        }
        const url = await uploadImageWithDB(file, userId, 'imageUploader');
        return url;
      } catch (error) {
        console.error('Image upload failed:', error);
        // Fallback to local preview if upload fails
        return URL.createObjectURL(file);
      }
    },
  }),
  Video.configure({
    upload: async (file: File) => {
      try {
        const result = await uploadFile(file, 'videoUploader');
        return result.data.url;
      } catch (error) {
        console.error('Video upload failed:', error);
        // Fallback to local preview if upload fails
        return URL.createObjectURL(file);
      }
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
  }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,
  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  Attachment.configure({
    upload: async (file: File) => {
      try {
        const result = await uploadFile(file, 'editorUploader');
        return result.data.url;
      } catch (error) {
        console.error('Attachment upload failed:', error);
        // Fallback to local preview if upload fails
        return URL.createObjectURL(file);
      }
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: async (file: File) => {
      try {
        const result = await uploadFile(file, 'editorUploader');
        return result.data.url;
      } catch (error) {
        console.error('Mermaid diagram upload failed:', error);
        // Fallback to base64 conversion if upload fails
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => {
            const blob = convertBase64ToBlob(reader.result as string);
            resolve(URL.createObjectURL(blob));
          };
          reader.readAsDataURL(file);
        });
      }
    },
  }),
  Drawer.configure({
    upload: async (file: File) => {
      try {
        const result = await uploadFile(file, 'editorUploader');
        return result.data.url;
      } catch (error) {
        console.error('Drawer upload failed:', error);
        // Fallback to base64 conversion if upload fails
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onload = () => {
            const blob = convertBase64ToBlob(reader.result as string);
            resolve(URL.createObjectURL(blob));
          };
          reader.readAsDataURL(file);
        });
      }
    },
  }),
  Twitter,
  Mention.configure({
    suggestions: [
      {
        char: '@',
        items: async ({ query }: { query: string }) => {
          return MOCK_USERS.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()));
        },
      },
      {
        char: '#',
        items: async ({ query }: { query: string }) => {
          return MOCK_USERS.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()));
        },
      },
    ],
  }),
  SlashCommand,
  Callout,
];

interface TipTapEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

// Main Editor Component
function TipTapEditor({ initialContent, onContentChange }: TipTapEditorProps) {
  const { data: session } = useSession();

  // Debounced callback using usehooks-ts (800ms delay)
  const debouncedContentChange = useDebounceCallback((content: string) => {
    if (onContentChange) {
      onContentChange(content);
    }
  }, 800);

  const editor = useEditor({
    content: initialContent || '',
    extensions: createExtensions(session?.user?.id),
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Call debounced update
      debouncedContentChange(html);
    },
  });

  // Sync initial content when it changes (e.g., loading a different post)
  useEffect(() => {
    if (editor && initialContent) {
      const currentContent = editor.getHTML();
      // Only update if content actually changed to avoid unnecessary updates
      if (currentContent !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="mx-auto my-0 w-full max-w-300 px-4">
      <RichTextProvider editor={editor}>
        <div className="overflow-hidden rounded-xl bg-background">
          <div className="my-editor flex max-h-full w-full flex-col">
            <EditorContent editor={editor} className="border-none! focus:border-none" />

            {/* Bubble Menus - chỉ hiển thị khi select text */}
            <RichTextBubbleText />
            <RichTextBubbleLink />
            <RichTextBubbleImage />
            <RichTextBubbleVideo />
            <RichTextBubbleImageGif />
            <RichTextBubbleTable />
            <RichTextBubbleColumns />
            <RichTextBubbleCallout />
            <RichTextBubbleDrawer />
            <RichTextBubbleExcalidraw />
            <RichTextBubbleIframe />
            <RichTextBubbleKatex />
            <RichTextBubbleMermaid />
            <RichTextBubbleTwitter />

            {/* Slash Command - hiển thị khi gõ "/" */}
            <SlashCommandList />
            <RichTextBubbleMenuDragHandle />
          </div>
        </div>
      </RichTextProvider>
    </div>
  );
}

export default TipTapEditor;
