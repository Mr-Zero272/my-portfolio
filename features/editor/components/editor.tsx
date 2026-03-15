'use client';

import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import GallerySelect from '@/features/gallery/components/gallery-select';
import TiptapEditor from '@/features/tiptap-editor';
import { useSmartPaste } from '@/hooks/use-smart-paste';
import { IImage } from '@/models';
import { Library, Plus, XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import useImagePreview from '../hooks/use-preview-image';
import { usePostStorage } from '../store/use-post-storage';

function Editor() {
  const [imageFromLibrary, setImageFromLibrary] = useState<IImage | null>(null);
  const { _id, title, content, featureImage: storeFeatureImage, imageCaption, setField } = usePostStorage();
  const { handlePaste } = useSmartPaste();

  console.log({
    content,
  });

  // Debounced content change handler - được gọi từ TiptapEditor
  const handleContentChange = useCallback(
    (value: string) => {
      setField('content', value);
    },
    [setField],
  );

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

  const handleSelectFeatureImage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setField('featureImageFile', file);
      }
      handleFileSelect(event);
    },
    [handleFileSelect, setField],
  );

  const handleSelectImageFromLibrary = useCallback(
    (image: IImage | null) => {
      if (!image) return;
      setImageFromLibrary(image);
      setField('featureImage', image.url);
    },
    [setField],
  );

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
                    className="mx-0 mt-1 border-none bg-accent shadow-none outline-0 focus-visible:bg-transparent focus-visible:ring-0"
                    placeholder="Image caption"
                    value={imageCaption || ''}
                    onChange={(e) => setField('imageCaption', e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (featureImage) removePreview(featureImage.id);
                      if (storeFeatureImage) setField('featureImage', '');
                      setField('featureImageFile', null);
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 cursor-pointer"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                {featureImage && (
                  <div className="mt-2 text-sm text-muted-foreground">Feature image: {featureImage.file.name}</div>
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
                    className="text-destructive hover:text-destructive"
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
                  className="cursor-pointer pl-0 text-sm font-normal hover:bg-transparent hover:text-foreground"
                  disabled={imageLoading}
                >
                  <Plus className="h-4 w-4" />
                  {imageLoading ? 'Uploading...' : 'Upload feature image'}
                </AnimatedButton>
                <Separator orientation="vertical" className="h-4" />
                <GallerySelect
                  onValueChange={handleSelectImageFromLibrary}
                  value={imageFromLibrary}
                  trigger={
                    <AnimatedButton variant="outline">
                      <Library />
                    </AnimatedButton>
                  }
                />
              </div>
            )}

            {imageError && <div className="mt-2 text-sm text-destructive">{imageError}</div>}

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
              className="min-w-full resize-none border-none px-0 text-4xl font-semibold text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
              placeholder="Post title"
              onPaste={(e) =>
                handlePaste(e, {
                  onContentDetected: (detectedContent) => {
                    setField('content', detectedContent);
                  },
                  onTitleDetected: (detectedTitle) => {
                    setField('title', detectedTitle);
                    setField('xMetaTitle', detectedTitle);
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
              style={{
                fontSize: '36px',
              }}
            />
          </div>

          <div className="my-editor">
            <TiptapEditor initialContent={content} onContentChange={handleContentChange} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Editor;
