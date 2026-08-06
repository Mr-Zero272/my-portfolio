import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  LexicalEditor,
  LexicalNode,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  Bold,
  Code,
  ExternalLink,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  MessageSquarePlus,
  Pencil,
  Quote,
  Strikethrough,
  Subscript,
  Superscript,
  Trash2,
  Type,
  Underline,
  X,
} from 'lucide-react';
import { Dispatch, JSX, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { blockTypeToBlockName } from '../../context/ToolbarContext';
import { getDOMRangeRect } from '../../utils/getDOMRangeRect';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { setFloatingElemPosition } from '../../utils/setFloatingElemPosition';
import { INSERT_INLINE_COMMAND } from '../CommentPlugin';

const blockTypeIcons = {
  bullet: List,
  check: List,
  code: Code,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading1,
  h5: Heading1,
  h6: Heading1,
  number: ListOrdered,
  paragraph: Type,
  quote: Quote,
};

function BlockTypeSelect({
  editor,
  blockType,
}: {
  editor: LexicalEditor;
  blockType: keyof typeof blockTypeToBlockName;
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  };

  return (
    <Select
      value={blockType}
      onValueChange={(value) => {
        if (value === 'paragraph') formatParagraph();
        else if (value === 'h1') formatHeading('h1');
        else if (value === 'h2') formatHeading('h2');
        else if (value === 'h3') formatHeading('h3');
        else if (value === 'bullet') formatBulletList();
        else if (value === 'number') formatNumberedList();
        else if (value === 'quote') formatQuote();
        else if (value === 'code') formatCode();
      }}
    >
      <SelectTrigger
        className="h-8 w-[130px] border-none bg-transparent px-2 hover:bg-muted focus:ring-0"
        onMouseDown={(e) => e.preventDefault()}
      >
        <SelectValue placeholder="Block Type">
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = blockTypeIcons[blockType] || Type;
              return <Icon className="h-4 w-4 shrink-0" />;
            })()}
            <span className="truncate text-xs font-medium">{blockTypeToBlockName[blockType]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="min-w-[150px]">
        <SelectItem value="paragraph">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Normal</span>
          </div>
        </SelectItem>
        <SelectItem value="h1">
          <div className="flex items-center gap-2">
            <Heading1 className="h-4 w-4" />
            <span>Heading 1</span>
          </div>
        </SelectItem>
        <SelectItem value="h2">
          <div className="flex items-center gap-2">
            <Heading2 className="h-4 w-4" />
            <span>Heading 2</span>
          </div>
        </SelectItem>
        <SelectItem value="h3">
          <div className="flex items-center gap-2">
            <Heading3 className="h-4 w-4" />
            <span>Heading 3</span>
          </div>
        </SelectItem>
        <Separator className="my-1" />
        <SelectItem value="bullet">
          <div className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Bullet List</span>
          </div>
        </SelectItem>
        <SelectItem value="number">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4" />
            <span>Numbered List</span>
          </div>
        </SelectItem>
        <SelectItem value="quote">
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4" />
            <span>Quote</span>
          </div>
        </SelectItem>
        <SelectItem value="code">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>Code Block</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function LinkEditor({ editor, setIsEditMode }: { editor: LexicalEditor; setIsEditMode: (val: boolean) => void }) {
  const [linkUrl, setLinkUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
        }
      }
    });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editor]);

  const updateLink = () => {
    if (linkUrl !== '') {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    }
    setIsEditMode(false);
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsEditMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateLink();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditMode(false);
    }
  };

  return (
    <div className="flex items-center gap-1 p-0.5">
      <Input
        ref={inputRef}
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter URL..."
        className="h-7 w-[180px] border-none bg-muted px-2 py-0 text-xs focus-visible:ring-0"
      />
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={updateLink}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={removeLink}
        onMouseDown={(e) => e.preventDefault()}
        title="Remove Link"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7"
        onClick={() => setIsEditMode(false)}
        onMouseDown={(e) => e.preventDefault()}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function LinkViewer({
  editor,
  url,
  onEdit,
}: {
  editor: LexicalEditor;
  url: string;
  onEdit: () => void;
}) {
  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  return (
    <div className="flex items-center gap-3 p-1 px-3">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="max-w-[250px] truncate text-xs text-blue-600 hover:underline"
      >
        {url}
      </a>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onEdit}
          onMouseDown={(e) => e.preventDefault()}
          title="Edit Link"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={removeLink}
          onMouseDown={(e) => e.preventDefault()}
          title="Remove Link"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isUppercase,
  isLowercase,
  isCapitalize,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  blockType,
  linkUrl,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
  isCapitalize: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
  blockType: keyof typeof blockTypeToBlockName;
  linkUrl: string;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);
  const [isEditLink, setIsEditLink] = useState(false);

  useEffect(() => {
    setIsLinkEditMode(isEditLink);
  }, [isEditLink, setIsLinkEditMode]);

  const toggleLink = useCallback(() => {
    setIsEditLink(true);
  }, []);

  const insertComment = () => {
    editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  };

  function mouseMoveListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }

  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      (isLink || !nativeSelection.isCollapsed) &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      let rect: DOMRect | null = null;
      if (isLink) {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection);
          const linkNode = $isLinkNode(node) ? node : node.getParent();
          if ($isLinkNode(linkNode)) {
            const linkElement = editor.getElementByKey(linkNode.getKey());
            if (linkElement) {
              rect = linkElement.getBoundingClientRect();
            }
          }
        }
      }

      if (!rect) {
        rect = getDOMRangeRect(nativeSelection, rootElement);
      }

      setFloatingElemPosition(rect, popupCharStylesEditorElem, anchorElem, isLink);
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="lexical-floating-toolbar absolute top-0 left-0 z-20 flex items-center gap-0.5 rounded-lg border bg-background p-1 opacity-0 shadow-lg transition-opacity duration-300 will-change-transform"
    >
      {editor.isEditable() && (
        <>
          {isEditLink ? (
            <LinkEditor editor={editor} setIsEditMode={setIsEditLink} />
          ) : isLink && linkUrl !== '' ? (
            <LinkViewer editor={editor} url={linkUrl} onEdit={() => setIsEditLink(true)} />
          ) : (
            <>
              <BlockTypeSelect editor={editor} blockType={blockType} />
              <Separator orientation="vertical" className="mx-1 h-6" />
              <div className="flex items-center gap-0.5">
                <Toggle
                  size="sm"
                  pressed={isBold}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isItalic}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isUnderline}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isStrikethrough}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isCode}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Code className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={isLink} onPressedChange={toggleLink} onMouseDown={(e) => e.preventDefault()}>
                  <Link className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <div className="flex items-center gap-0.5">
                <Toggle
                  size="sm"
                  pressed={isUppercase}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="text-[10px] font-bold">AA</span>
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isLowercase}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="text-[10px] font-bold">aa</span>
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isCapitalize}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="text-[10px] font-bold">Aa</span>
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isSubscript}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Subscript className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={isSuperscript}
                  onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Superscript className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="mx-1 h-6 max-lg:hidden" />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 max-lg:hidden"
                onClick={insertComment}
                onMouseDown={(e) => e.preventDefault()}
                title="Insert comment"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');

  const updatePopup = useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.closest('.lexical-floating-toolbar')) {
      return;
    }

    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) || rootElement === null || !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsUppercase(selection.hasFormat('uppercase'));
      setIsLowercase(selection.hasFormat('lowercase'));
      setIsCapitalize(selection.hasFormat('capitalize'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));

      const parent = node.getParent();
      const isLinkNode = $isLinkNode(parent) || $isLinkNode(node);
      setIsLink(isLinkNode);

      if (isLinkNode) {
        setLinkUrl($isLinkNode(parent) ? parent.getURL() : ($isLinkNode(node) ? node.getURL() : ''));
      } else {
        setLinkUrl('');
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type as keyof typeof blockTypeToBlockName);
      } else {
        const type = $isHeadingNode(element) ? element.getTag() : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type as keyof typeof blockTypeToBlockName);
        }
      }

      const isCodeHighlightNode = (node: LexicalNode) => {
        return $isCodeNode(node) || $isCodeNode(node.getParent());
      };

      if (!isCodeHighlightNode(selection.anchor.getNode())) {
        if (isLinkNode || selection.getTextContent() !== '') {
          setIsText($isTextNode(node) || $isParagraphNode(node) || isLinkNode);
        } else {
          setIsText(false);
        }
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUppercase={isUppercase}
      isLowercase={isLowercase}
      isCapitalize={isCapitalize}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      blockType={blockType}
      linkUrl={linkUrl}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem,
  );
}

export default function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode);
}
