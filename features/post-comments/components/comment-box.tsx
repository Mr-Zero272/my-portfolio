'use client';

import ImageUploadDialog from '@/components/shared/image-upload-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { uploadImageWithDB } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import Underline from '@tiptap/extension-underline';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Loader2, Send, UnderlineIcon, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImagesUpload from './images-upload';

type ImageItem = {
  id: string;
  url: string;
  file?: File; // For new uploads
  isExisting?: boolean; // For existing images in edit mode
};

type CommentBoxProps = {
  onSubmit: (content: string, images?: string[]) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  showCancel?: boolean;
  isMobileMode?: boolean;
  className?: string;
  // Edit mode props
  mode?: 'create' | 'edit';
  initialContent?: string;
  initialImages?: string[]; // URLs of existing images
};

export default function CommentBox({
  onSubmit,
  onCancel,
  isSubmitting = false,
  placeholder = 'Leave a comment...',
  showCancel = false,
  isMobileMode = false,
  className,
  mode = 'create',
  initialContent = '',
  initialImages = [],
}: CommentBoxProps) {
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [borderRadius, setBorderRadius] = useState(() => {
    if (isMobileMode) return 'rounded-full';
    return 'rounded-xl';
  });
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(false);

  // Unified image management
  const [images, setImages] = useState<ImageItem[]>(() => {
    // Initialize with existing images in edit mode
    if (mode === 'edit' && initialImages.length > 0) {
      return initialImages.map((url, index) => ({
        id: `existing-${index}`,
        url,
        isExisting: true,
      }));
    }
    return [];
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    immediatelyRender: false, // avoid hydration issues
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      setIsActive(editor.getText().trim().length > 0 || images.length > 0);
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

  // Generate display URLs for preview
  const displayImages = useMemo(() => {
    return images.map((img) => {
      if (img.isExisting) {
        return img.url;
      }
      // For new uploads, create object URL
      return img.file ? URL.createObjectURL(img.file) : img.url;
    });
  }, [images]);

  // Cleanup preview URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file && !img.isExisting) {
          URL.revokeObjectURL(URL.createObjectURL(img.file));
        }
      });
    };
  }, [images]);

  useEffect(() => {
    if (editor && !isSubmitting) {
      editor.commands.focus();
    }
  }, [editor, isSubmitting]);

  // Check if content has changed (for edit mode)
  const hasChanges = useMemo(() => {
    if (mode === 'create' && editor) {
      return editor?.getText().trim().length > 0 || images.length > 0;
    }

    // Edit mode: check if content or images changed
    const contentChanged = editor?.getText().trim() !== initialContent.trim();
    const imagesChanged =
      images.length !== initialImages.length ||
      images.some((img, idx) => {
        if (img.isExisting) {
          return img.url !== initialImages[idx];
        }
        return true; // New images are always considered changes
      });

    return contentChanged || imagesChanged;
  }, [editor, images, mode, initialContent, initialImages]);

  useEffect(() => {
    setIsActive(hasChanges);
  }, [hasChanges]);

  if (!editor) {
    return null;
  }

  const handleSend = async () => {
    const content = editor.getText().trim();
    if (!content && images.length === 0) return;

    try {
      // Separate existing and new images
      const existingImageUrls = images.filter((img) => img.isExisting).map((img) => img.url);
      const newImageFiles = images.filter((img) => img.file && !img.isExisting);

      // Upload new images
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        const uploadPromises = newImageFiles.map((item) => {
          return uploadImageWithDB(item.file!, session?.user?.id || '');
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }

      // Combine existing and newly uploaded URLs
      const allImageUrls = [...existingImageUrls, ...uploadedUrls];

      await onSubmit(content, allImageUrls.length > 0 ? allImageUrls : undefined);

      // Cleanup preview URLs for new images
      images.forEach((img) => {
        if (img.file && !img.isExisting) {
          URL.revokeObjectURL(URL.createObjectURL(img.file));
        }
      });

      // Reset form (only in create mode)
      if (mode === 'create') {
        editor.commands.clearContent();
        setImages([]);
        setIsActive(false);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCancel = () => {
    // Cleanup preview URLs for new images
    images.forEach((img) => {
      if (img.file && !img.isExisting) {
        URL.revokeObjectURL(URL.createObjectURL(img.file));
      }
    });

    if (mode === 'create') {
      editor.commands.clearContent();
      setImages([]);
      setIsActive(false);
    } else {
      // Reset to initial state in edit mode
      editor.commands.setContent(initialContent);
      setImages(
        initialImages.map((url, index) => ({
          id: `existing-${index}`,
          url,
          isExisting: true,
        })),
      );
      setIsActive(false);
    }

    onCancel?.();
  };

  const handleImagesSelected = (files: File[]) => {
    const newImages: ImageItem[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const imageToRemove = prev[index];

      // Revoke the URL if it's a new upload
      if (imageToRemove.file && !imageToRemove.isExisting) {
        URL.revokeObjectURL(imageToRemove.url);
      }

      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };
  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
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
          {/* {!isMobileMode && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'username'} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {session?.user?.name?.charAt?.(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          )} */}

          {/* bubble menu */}
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="z-50 rounded-md border bg-white p-1 shadow-lg"
          >
            {/* Bold Button */}
            <Toggle title="Bold" pressed={editor.isActive('bold')} onPressedChange={toggleBold} size="sm">
              <Bold size={16} strokeWidth={2.5} />
            </Toggle>

            {/* Italic Button */}
            <Toggle pressed={editor.isActive('italic')} onPressedChange={toggleItalic} title="Italic" size="sm">
              <Italic size={16} strokeWidth={2.5} />
            </Toggle>

            {/* Underline Button */}
            <Toggle
              pressed={editor.isActive('underline')}
              onPressedChange={toggleUnderline}
              title="Underline"
              size="sm"
            >
              <UnderlineIcon size={16} strokeWidth={2.5} />
            </Toggle>
          </BubbleMenu>

          <div ref={editorWrapperRef} className="min-w-0 flex-1">
            <EditorContent
              placeholder={placeholder}
              editor={editor}
              className="prose prose-sm max-w-none focus:outline-none"
            />
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
          {images.length === 0 ? (
            <div className="flex items-center gap-1">
              {/* <Separator orientation="vertical" className="mx-1 h-4" /> */}

              {/* Upload Images Button */}
              <ImageUploadDialog onImagesSelected={handleImagesSelected} maxFiles={5} />
            </div>
          ) : (
            <div>
              <ImagesUpload images={displayImages} onRemove={handleRemoveImage} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {showCancel && (
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting} className="h-8 px-3">
                <X size={14} />
                Cancel
              </Button>
            )}

            <AnimatedButton onClick={handleSend} disabled={!isActive || isSubmitting} size="sm" className="h-8 px-4">
              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Sending...') : mode === 'edit' ? 'Update' : 'Send'}
            </AnimatedButton>
          </div>
        </div>
      }
    </div>
  );
}
