'use client';

import ImageUploadDialog from '@/components/shared/image-upload-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { uploadImageWithDB } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImagesUpload from './images-upload';

type CommentBoxProps = {
  onSubmit: (content: string, images?: string[]) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  placeholder?: string;
  showCancel?: boolean;
  isMobileMode?: boolean;
  className?: string;
};

export default function CommentBox({
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = 'Viết bình luận của bạn...',
  showCancel = false,
  isMobileMode = false,
  className,
}: CommentBoxProps) {
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [borderRadius, setBorderRadius] = useState(() => {
    if (isMobileMode) return 'rounded-full';
    return 'rounded-xl';
  });
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      setIsActive(editor.getText().trim().length > 0 || uploadedImages.length > 0);
    },
  });

  useEffect(() => {
    if (!editorWrapperRef.current) return;

    if (!isMobileMode) {
      setBorderRadius('rounded-xl');
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        if (height <= 21) {
          // 1 dòng
          setBorderRadius('rounded-full');
        } else if (height <= 42) {
          // 1-2 dòng
          setBorderRadius('rounded-3xl');
        } else if (height <= 63) {
          // 2-3 dòng
          setBorderRadius('rounded-3xl'); // Bo lớn hơn một chút
        } else {
          // 3+ dòng (scroll)
          setBorderRadius('rounded-3xl'); // Bo nhẹ
        }
      }
    });

    // Tìm phần tử .ProseMirror bên trong editorWrapperRef
    const proseMirrorElement = editorWrapperRef.current.querySelector('.ProseMirror') as HTMLElement;
    if (proseMirrorElement) {
      observer.observe(proseMirrorElement);
    }

    return () => observer.disconnect();
  }, [editor, isMobileMode]); // Chạy lại khi editor được khởi tạo

  const listImages = useMemo(() => {
    return uploadedImages.map((file) => URL.createObjectURL(file));
  }, [uploadedImages]);

  // Cleanup preview URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      listImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [listImages]);

  useEffect(() => {
    if (editor && !isSubmitting) {
      editor.commands.focus();
    }
  }, [editor, isSubmitting]);

  if (!editor) {
    return null;
  }

  const handleSend = async () => {
    const content = editor.getText().trim();
    if (!content && uploadedImages.length === 0) return;

    try {
      const uploadPromises = uploadedImages.map((file) => {
        return uploadImageWithDB(file, session?.user?.id || '');
      });

      const imageUrls = await Promise.all(uploadPromises);

      await onSubmit(content, imageUrls.length > 0 ? imageUrls : undefined);

      // Cleanup preview URLs before reset
      listImages.forEach((url) => URL.revokeObjectURL(url));

      // Reset form
      editor.commands.clearContent();
      setUploadedImages([]);
      setIsActive(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCancel = () => {
    // Cleanup preview URLs before reset
    listImages.forEach((url) => URL.revokeObjectURL(url));

    editor.commands.clearContent();
    setUploadedImages([]);
    setIsActive(false);
    onCancel?.();
  };

  const handleImagesSelected = (images: File[]) => {
    setUploadedImages((prev) => [...prev, ...images]);
    setIsActive(editor.getText().trim().length > 0 || images.length > 0);
  };

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      // Revoke the URL of the removed image
      if (listImages[index]) {
        URL.revokeObjectURL(listImages[index]);
      }

      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'border-border bg-background focus-within:border-primary focus-within:ring-primary/10 border-2 px-4 py-1 ring-1 ring-transparent transition-colors',
          {
            [borderRadius]: true,
          },
        )}
      >
        {/* User Avatar & Editor */}
        <div className="flex gap-3">
          {/* <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'username'} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {session?.user?.name?.charAt?.(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar> */}

          <div ref={editorWrapperRef} className="min-w-0 flex-1">
            <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none" />
          </div>
        </div>

        <style>{`
            .ProseMirror {
              min-height: ${isMobileMode ? '1.5rem' : '6rem'};
              outline: none;
              padding: 8px 0;
              font-size: 14px;
              line-height: 1.5;
              max-height: 4.5rem;
              overflow-y: auto;
            }
            .ProseMirror p {
              margin: 0;
            }
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: hsl(var(--muted-foreground));
              pointer-events: none;
              height: 0;
            }
            .ProseMirror strong {
              font-weight: 600;
            }
            .ProseMirror em {
              font-style: italic;
            }
            .ProseMirror u {
              text-decoration: underline;
            }
          `}</style>
      </div>

      {/* Toolbar */}
      {
        <div className="border-border flex items-start justify-between pt-2">
          {uploadedImages.length === 0 ? (
            <div className="flex items-center gap-1">
              {/* Bold Button */}
              {/* <Toggle title="Bold" pressed={editor.isActive('bold')} onPressedChange={toggleBold} size="sm">
                <Bold size={16} strokeWidth={2.5} />
              </Toggle> */}

              {/* Italic Button */}
              {/* <Toggle pressed={editor.isActive('italic')} onPressedChange={toggleItalic} title="Italic" size="sm">
                <Italic size={16} strokeWidth={2.5} />
              </Toggle> */}

              {/* Underline Button */}
              {/* <Toggle
                pressed={editor.isActive('underline')}
                onPressedChange={toggleUnderline}
                title="Underline"
                size="sm"
              >
                <UnderlineIcon size={16} strokeWidth={2.5} />
              </Toggle> */}

              {/* <Separator orientation="vertical" className="mx-1 h-4" /> */}

              {/* Upload Images Button */}
              <ImageUploadDialog onImagesSelected={handleImagesSelected} maxFiles={5} />
            </div>
          ) : (
            <div>
              <ImagesUpload images={listImages} onRemove={handleRemoveImage} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {showCancel && (
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting} className="h-8 px-3">
                <X size={14} />
                Hủy
              </Button>
            )}

            <AnimatedButton onClick={handleSend} disabled={!isActive || isSubmitting} size="sm" className="h-8 px-4">
              <Send size={14} />
              {isSubmitting ? 'Đang gửi...' : 'Gửi'}
            </AnimatedButton>
          </div>
        </div>
      }
    </div>
  );
}
