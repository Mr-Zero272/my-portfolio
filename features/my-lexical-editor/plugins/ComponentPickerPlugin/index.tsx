/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react';

import { $createCodeNode } from '@lexical/code';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BarChart2,
  Calendar,
  ChevronRight,
  Code,
  Columns3,
  Grid2x2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  PenLine,
  Pilcrow,
  Quote,
  Scissors,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { ScrollArea } from '@/components/ui/scroll-area';

import useModal from '../../hooks/useModal';
import { EmbedConfigs } from '../AutoEmbedPlugin';
import { INSERT_COLLAPSIBLE_COMMAND } from '../CollapsiblePlugin';
import { INSERT_DATETIME_COMMAND } from '../DateTimePlugin';
import { INSERT_EXCALIDRAW_COMMAND } from '../ExcalidrawPlugin';
import { InsertImageDialog } from '../ImagesPlugin';
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog';
import { INSERT_PAGE_BREAK } from '../PageBreakPlugin';
import { InsertPollDialog } from '../PollPlugin';
import { InsertTableDialog } from '../TablePlugin';

export class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

export function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors ${
        isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
      }`}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.icon && (
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
          {option.icon}
        </span>
      )}
      <span>{option.title}</span>
    </li>
  );
}

export function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2] ? [tableMatch[2]] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: <Grid2x2 />,
            keywords: ['table'],
            onSelect: () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          }),
      ),
    );
  }

  return options;
}

export type ShowModal = ReturnType<typeof useModal>[1];

export function getBaseOptions(editor: LexicalEditor, showModal: ShowModal) {
  return [
    new ComponentPickerOption('Paragraph', {
      icon: <Pilcrow />,
      keywords: ['normal', 'paragraph', 'p', 'text'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Heading ${n}`, {
          icon: n === 1 ? <Heading1 /> : n === 2 ? <Heading2 /> : <Heading3 />,
          keywords: ['heading', 'header', `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        }),
    ),
    new ComponentPickerOption('Table', {
      icon: <Grid2x2 />,
      keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
      onSelect: () =>
        showModal('Insert Table', (onClose) => <InsertTableDialog activeEditor={editor} onClose={onClose} />),
    }),
    new ComponentPickerOption('Numbered List', {
      icon: <ListOrdered />,
      keywords: ['numbered list', 'ordered list', 'ol'],
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Bulleted List', {
      icon: <List />,
      keywords: ['bulleted list', 'unordered list', 'ul'],
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Check List', {
      icon: <ListChecks />,
      keywords: ['check list', 'todo list'],
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Quote', {
      icon: <Quote />,
      keywords: ['block quote'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption('Code', {
      icon: <Code />,
      keywords: ['javascript', 'python', 'js', 'codeblock'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption('Divider', {
      icon: <Minus />,
      keywords: ['horizontal rule', 'divider', 'hr'],
      onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new ComponentPickerOption('Page Break', {
      icon: <Scissors />,
      keywords: ['page break', 'divider'],
      onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
    }),
    new ComponentPickerOption('Excalidraw', {
      icon: <PenLine />,
      keywords: ['excalidraw', 'diagram', 'drawing'],
      onSelect: () => editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
    }),
    new ComponentPickerOption('Poll', {
      icon: <BarChart2 />,
      keywords: ['poll', 'vote'],
      onSelect: () =>
        showModal('Insert Poll', (onClose) => <InsertPollDialog activeEditor={editor} onClose={onClose} />),
    }),
    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
          icon: embedConfig.icon,
          keywords: [...embedConfig.keywords, 'embed'],
          onSelect: () => editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        }),
    ),
    new ComponentPickerOption('Date', {
      icon: <Calendar />,
      keywords: ['date', 'calendar', 'time'],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption('Today', {
      icon: <Calendar />,
      keywords: ['date', 'calendar', 'time', 'today'],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption('Tomorrow', {
      icon: <Calendar />,
      keywords: ['date', 'calendar', 'time', 'tomorrow'],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 1);
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption('Yesterday', {
      icon: <Calendar />,
      keywords: ['date', 'calendar', 'time', 'yesterday'],
      onSelect: () => {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() - 1);
        dateTime.setHours(0, 0, 0, 0); // Set time to midnight
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, { dateTime });
      },
    }),
    new ComponentPickerOption('Image', {
      icon: <ImageIcon />,
      keywords: ['image', 'photo', 'picture', 'file'],
      onSelect: () =>
        showModal('Insert Image', (onClose) => <InsertImageDialog activeEditor={editor} onClose={onClose} />),
    }),
    new ComponentPickerOption('Collapsible', {
      icon: <ChevronRight />,
      keywords: ['collapse', 'collapsible', 'toggle'],
      onSelect: () => editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    }),
    new ComponentPickerOption('Columns Layout', {
      icon: <Columns3 />,
      keywords: ['columns', 'layout', 'grid'],
      onSelect: () =>
        showModal('Insert Columns Layout', (onClose) => <InsertLayoutDialog activeEditor={editor} onClose={onClose} />),
    }),
    ...(['left', 'center', 'right', 'justify'] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon:
            alignment === 'left' ? (
              <AlignLeft />
            ) : alignment === 'center' ? (
              <AlignCenter />
            ) : alignment === 'right' ? (
              <AlignRight />
            ) : (
              <AlignJustify />
            ),
          keywords: ['align', 'justify', alignment],
          onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        }),
    ),
  ];
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    allowWhitespace: true,
    minLength: 0,
  });

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

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
          anchorElementRef.current && options.length
            ? createPortal(
                <div className="w-65 overflow-hidden rounded-lg border bg-white shadow-md dark:bg-zinc-900">
                  <ScrollArea className="max-h-72 overflow-y-auto">
                    <ul>
                      {options.map((option, i) => (
                        <ComponentPickerMenuItem
                          index={i}
                          isSelected={selectedIndex === i}
                          onClick={() => selectOptionAndCleanUp(option)}
                          onMouseEnter={() => setHighlightedIndex(i)}
                          key={option.key}
                          option={option}
                        />
                      ))}
                    </ul>
                  </ScrollArea>
                </div>,
                anchorElementRef.current,
              )
            : null
        }
      />
    </>
  );
}
