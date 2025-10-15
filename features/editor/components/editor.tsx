'use client';

import { uploadFile, uploadImageWithDB, uploadMultipleFiles } from '@/lib/uploadthing';
import NextImage from 'next/image';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';
import useImagePreview from '../hooks/use-preview-image';

import {
  BubbleMenuDrawer,
  BubbleMenuExcalidraw,
  BubbleMenuKatex,
  BubbleMenuMermaid,
  BubbleMenuTwitter,
} from 'reactjs-tiptap-editor/bubble-extra';

import { Attachment } from 'reactjs-tiptap-editor/attachment';
import { Blockquote } from 'reactjs-tiptap-editor/blockquote';
import { BulletList } from 'reactjs-tiptap-editor/bulletlist';
import { Clear } from 'reactjs-tiptap-editor/clear';
import { Code } from 'reactjs-tiptap-editor/code';
import { CodeBlock } from 'reactjs-tiptap-editor/codeblock';
import { Color } from 'reactjs-tiptap-editor/color';
import { Drawer } from 'reactjs-tiptap-editor/drawer';
import { Emoji } from 'reactjs-tiptap-editor/emoji';
import { Excalidraw } from 'reactjs-tiptap-editor/excalidraw';
import { ExportPdf } from 'reactjs-tiptap-editor/exportpdf';
import { ExportWord } from 'reactjs-tiptap-editor/exportword';
import { FontFamily } from 'reactjs-tiptap-editor/fontfamily';
import { FontSize } from 'reactjs-tiptap-editor/fontsize';
import { FormatPainter } from 'reactjs-tiptap-editor/formatpainter';
import { Heading } from 'reactjs-tiptap-editor/heading';
import { Highlight } from 'reactjs-tiptap-editor/highlight';
import { History } from 'reactjs-tiptap-editor/history';
import { HorizontalRule } from 'reactjs-tiptap-editor/horizontalrule';
import { Iframe } from 'reactjs-tiptap-editor/iframe';
import { Image } from 'reactjs-tiptap-editor/image';
import { ImageGif } from 'reactjs-tiptap-editor/imagegif';
import { ImportWord } from 'reactjs-tiptap-editor/importword';
import { Indent } from 'reactjs-tiptap-editor/indent';
import { Italic } from 'reactjs-tiptap-editor/italic';
import { Katex } from 'reactjs-tiptap-editor/katex';
import { LineHeight } from 'reactjs-tiptap-editor/lineheight';
import { Link } from 'reactjs-tiptap-editor/link';
import { Mention } from 'reactjs-tiptap-editor/mention';
import { Mermaid } from 'reactjs-tiptap-editor/mermaid';
import { MoreMark } from 'reactjs-tiptap-editor/moremark';
import { ColumnActionButton } from 'reactjs-tiptap-editor/multicolumn';
import { OrderedList } from 'reactjs-tiptap-editor/orderedlist';
import { SearchAndReplace } from 'reactjs-tiptap-editor/searchandreplace';
import { SlashCommand } from 'reactjs-tiptap-editor/slashcommand';
import { Strike } from 'reactjs-tiptap-editor/strike';
import { Table } from 'reactjs-tiptap-editor/table';
import { TableOfContents } from 'reactjs-tiptap-editor/tableofcontent';
import { TaskList } from 'reactjs-tiptap-editor/tasklist';
import { TextAlign } from 'reactjs-tiptap-editor/textalign';
import { TextDirection } from 'reactjs-tiptap-editor/textdirection';
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline';
import { Twitter } from 'reactjs-tiptap-editor/twitter';
import { Video } from 'reactjs-tiptap-editor/video';

import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import 'reactjs-tiptap-editor/style.css';

import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSmartPaste } from '@/hooks/use-smart-paste';
import '@excalidraw/excalidraw/index.css';
import 'easydrawer/styles.css';
import 'katex/dist/katex.min.css';
import { Plus, XIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceCallback } from 'usehooks-ts';
import { usePostStorage } from '../store/use-post-storage';

function Editor() {
  const { data: session } = useSession();

  const extensions = useMemo(
    () => [
      BaseKit.configure({
        placeholder: {
          showOnlyCurrent: true,
        },
      }),
      History,
      SearchAndReplace,
      TableOfContents,
      FormatPainter.configure({ spacer: true }),
      Clear,
      FontFamily,
      Heading.configure({ spacer: true }),
      FontSize,
      Italic,
      TextUnderline,
      Strike,
      MoreMark,
      Emoji,
      Color.configure({ spacer: true }),
      Highlight,
      BulletList,
      OrderedList,
      TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
      Indent,
      LineHeight,
      TaskList.configure({
        spacer: true,
        taskItem: {
          nested: true,
        },
      }),
      Link,
      Image.configure({
        upload: async (files: File) => {
          try {
            if (session?.user?.id) {
              // Upload và lưu vào database nếu user đã đăng nhập
              return await uploadImageWithDB(files, session.user.id, 'imageUploader');
            } else {
              // Fallback: chỉ upload file nếu user chưa đăng nhập
              const response = await uploadFile(files, 'imageUploader');
              return response.data.url;
            }
          } catch (error) {
            console.error('Failed to upload image:', error);
            throw error;
          }
        },
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto;',
        },
      }),
      Video.configure({
        upload: async (files: File) => {
          try {
            const response = await uploadFile(files, 'videoUploader');
            return response.data.url;
          } catch (error) {
            console.error('Failed to upload video:', error);
            throw error;
          }
        },
      }),
      ImageGif.configure({
        GIPHY_API_KEY: process.env.NEXT_PUBLIC_GIPHY_API_KEY as string,
      }),
      Blockquote,
      SlashCommand,
      HorizontalRule,
      Code.configure({
        toolbar: false,
      }),
      CodeBlock,
      ColumnActionButton,
      Table,
      Iframe,
      ExportPdf.configure({ spacer: true }),
      ImportWord.configure({
        upload: async (files: File[]) => {
          try {
            const uploadResult = await uploadMultipleFiles(files, 'attachmentUploader');
            return uploadResult;
          } catch (error) {
            console.error('Failed to upload Word files:', error);
            throw error;
          }
        },
      }),
      ExportWord,
      TextDirection,
      Mention,
      Attachment.configure({
        upload: async (file: File) => {
          try {
            const response = await uploadFile(file, 'attachmentUploader');
            return response.data.url;
          } catch (error) {
            console.error('Failed to upload attachment:', error);
            throw error;
          }
        },
      }),

      Katex,
      Excalidraw,
      Mermaid.configure({
        upload: async (file: File) => {
          try {
            if (session?.user?.id) {
              // Upload và lưu vào database nếu user đã đăng nhập
              return await uploadImageWithDB(file, session.user.id, 'imageUploader');
            } else {
              // Fallback: chỉ upload file nếu user chưa đăng nhập
              const response = await uploadFile(file, 'imageUploader');
              return response.data.url;
            }
          } catch (error) {
            console.error('Failed to upload Mermaid diagram:', error);
            throw error;
          }
        },
      }),
      Drawer.configure({
        upload: async (file: File) => {
          try {
            if (session?.user?.id) {
              // Upload và lưu vào database nếu user đã đăng nhập
              return await uploadImageWithDB(file, session.user.id, 'imageUploader');
            } else {
              // Fallback: chỉ upload file nếu user chưa đăng nhập
              const response = await uploadFile(file, 'imageUploader');
              return response.data.url;
            }
          } catch (error) {
            console.error('Failed to upload drawing:', error);
            throw error;
          }
        },
      }),
      Twitter,
    ],
    [session],
  );

  // const { editorRef } = useEditorState();
  const { theme } = useTheme();
  const { _id, title, content, featureImage: storeFeatureImage, imageCaption, setField } = usePostStorage();
  const { handlePaste } = useSmartPaste();
  const [editorKey, setEditorKey] = useState(`key-${_id}`);

  const debouncedOnValueChange = useDebounceCallback((value: string) => {
    setField('content', value);
  }, 300);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleResize = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, []);
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Hook để xử lý feature image
  const {
    previews,
    handleFileSelect,
    removePreview,
    error: imageError,
    isLoading: imageLoading,
  } = useImagePreview({
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    multiple: false,
  });

  const featureImage = previews[0] || null;

  const handleUploadLocalImage = useCallback(() => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  }, []);

  const handleSelectFeatureImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setField('featureImageFile', file);
    }
    handleFileSelect(event);
  };

  // if post id change mean new post, then set new key to reset editor
  useEffect(() => {
    if (!editorKey.includes(_id)) {
      setEditorKey(`key-${_id}-${Date.now()}`);
    }
  }, [_id, editorKey]);

  return (
    <main
      style={{
        padding: '0 20px',
      }}
    >
      <div className="mx-auto mt-5 mb-32 max-w-[1024px] overflow-hidden">
        <div>
          <div className="md:px-20">
            {featureImage || storeFeatureImage ? (
              <div className="mb-4">
                <div className="relative inline-block w-full rounded-lg">
                  <NextImage
                    src={featureImage ? featureImage.preview : storeFeatureImage || ''}
                    alt="Feature image preview"
                    width={1000}
                    height={600}
                    className="h-auto max-w-full rounded-lg object-cover"
                    unoptimized
                  />
                  {/* Image caption  */}
                  <Input
                    className="bg-accent mx-0 mt-1 border-none shadow-none outline-0 focus-visible:bg-transparent focus-visible:ring-0"
                    placeholder="Image caption"
                    value={imageCaption || ''}
                    onChange={(e) => setField('imageCaption', e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (featureImage) removePreview(featureImage.id);
                      if (storeFeatureImage) setField('featureImage', '');
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                {featureImage && (
                  <div className="text-muted-foreground mt-2 text-sm">Feature image: {featureImage.file.name}</div>
                )}
                <div className="mt-2 flex gap-2">
                  <AnimatedButton onClick={handleUploadLocalImage} variant="outline" size="sm">
                    Change image
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => {
                      if (featureImage) removePreview(featureImage.id);
                      if (storeFeatureImage) setField('featureImage', '');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Remove
                  </AnimatedButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AnimatedButton
                  onClick={handleUploadLocalImage}
                  variant="ghost"
                  className="hover:text-foreground cursor-pointer pl-0 text-sm font-normal hover:bg-transparent"
                  disabled={imageLoading}
                >
                  <Plus className="h-4 w-4" />
                  {imageLoading ? 'Uploading...' : 'Upload feature image'}
                </AnimatedButton>
              </div>
            )}

            {imageError && <div className="text-destructive mt-2 text-sm">{imageError}</div>}

            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleSelectFeatureImage}
              ref={inputFileRef}
            />
          </div>
          <div className="md:px-20">
            <Textarea
              ref={titleRef}
              value={title || ''}
              className="text-foreground min-w-full resize-none border-none px-0 !text-4xl font-semibold shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
              placeholder="Post title"
              onPaste={(e) =>
                handlePaste(e, {
                  onContentDetected: (detectedContent) => {
                    setEditorKey(`key-${_id}-${Date.now()}`);
                    setField('content', detectedContent);
                  },
                  onTitleDetected: (detectedTitle) => {
                    setField('title', detectedTitle);
                    setField('xMetaTitle', detectedTitle);
                    setField('metaTitle', detectedTitle);
                    setTimeout(() => {
                      handleTitleResize();
                    }, 300);
                  },
                  onContentPlainTextDetected: (plainTextContent) => {
                    let metaDescription = plainTextContent.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
                    if (plainTextContent.length > 145) {
                      // Lấy 142 ký tự đầu tiên và thêm "..."
                      metaDescription = plainTextContent.slice(0, 142) + '...';
                    } else {
                      metaDescription = plainTextContent;
                    }
                    setField('metaDescription', metaDescription);
                    setField('xMetaDescription', metaDescription);
                    setField('excerpt', metaDescription);
                  },
                })
              }
              onChange={(e) => {
                setField('title', e.target.value);
                handleTitleResize();
              }}
              required
            />
          </div>

          <div className="my-editor">
            <RichTextEditor
              // ref={editorRef}
              key={editorKey} // Sử dụng key để reset editor khi cần
              contentClass="p-0 !shadow-none !outline-none"
              output="html"
              content={content || ''}
              onChangeContent={debouncedOnValueChange}
              extensions={extensions}
              dark={theme === 'dark'}
              disabled={false}
              hideToolbar
              bubbleMenu={{
                render({ extensionsNames, editor, disabled }, bubbleDefaultDom) {
                  return (
                    <>
                      {bubbleDefaultDom}
                      {extensionsNames.includes('twitter') ? (
                        <BubbleMenuTwitter disabled={disabled} editor={editor} key="twitter" />
                      ) : null}
                      {extensionsNames.includes('katex') ? (
                        <BubbleMenuKatex disabled={disabled} editor={editor} key="katex" />
                      ) : null}
                      {extensionsNames.includes('excalidraw') ? (
                        <BubbleMenuExcalidraw disabled={disabled} editor={editor} key="excalidraw" />
                      ) : null}
                      {extensionsNames.includes('mermaid') ? (
                        <BubbleMenuMermaid disabled={disabled} editor={editor} key="mermaid" />
                      ) : null}
                      {extensionsNames.includes('drawer') ? (
                        <BubbleMenuDrawer disabled={disabled} editor={editor} key="drawer" />
                      ) : null}
                    </>
                  );
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Editor;
