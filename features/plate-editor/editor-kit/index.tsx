'use client';

import { type Value, TrailingBlockPlugin } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { AlignKit } from './align-kit';
import { AutoformatKit } from './autoformat-kit';
import { BasicBlocksKit } from './basic-blocks-kit';
import { BasicMarksKit } from './basic-marks-kit';
import { BlockMenuKit } from './block-menu-kit';
import { BlockPlaceholderKit } from './block-placeholder-kit';
import { CodeBlockKit } from './code-block-kit';
import { DateKit } from './date-kit';
import { DndKit } from './dnd-kit';
import { EmojiKit } from './emoji-kit';
import { ExitBreakKit } from './exit-break-kit';
import { FixedToolbarKit } from './fixed-toolbar-kit';
import { FloatingToolbarKit } from './floating-toolbar-kit';
import { FontKit } from './font-kit';
import { LineHeightKit } from './line-height-kit';
import { LinkKit } from './link-kit';
import { ListKit } from './list-kit';
import { MarkdownKit } from './markdown-kit';
import { MediaKit } from './media-kit';
import { MentionKit } from './mention-kit';
import { SlashKit } from './slash-kit';

export const EditorKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...MediaKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>;

export const useEditor = () => useEditorRef<MyEditor>();
