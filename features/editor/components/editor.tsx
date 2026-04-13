'use client';

import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import GallerySelect from '@/features/gallery/components/gallery-select';
import GhostLikeEditor from '@/features/my-lexical-editor/GhostLikeEditor';
import { useSmartPaste } from '@/hooks/use-smart-paste';
import { IImage } from '@/models';
import { Library, Plus, XIcon } from 'lucide-react';
import NextImage from 'next/image';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import useImagePreview from '../hooks/use-preview-image';
import { type PostSchema } from '../schema';
import { usePostStorage } from '../store/use-post-storage';

function Editor() {
  const [imageFromLibrary, setImageFromLibrary] = useState<IImage | null>(null);
  const { handlePaste } = useSmartPaste();
  const setIsSyncing = usePostStorage((state) => state.setIsSyncing);

  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PostSchema>();

  const title = watch('title');
  const storeFeatureImage = watch('featureImage');
  const imageCaption = watch('imageCaption');
  const content = watch('content');

  // Debounced content change handler
  const handleContentChange = useCallback(
    (json: string, html: string) => {
      setIsSyncing(true);
      // We'll use a local timeout or useEffect to handle the 1.5s delay
      // For now, update the form value immediately but trigger "syncing" UI
      setValue('content', json, { shouldDirty: true });
      setValue('contentHtml', html, { shouldDirty: true });
    },
    [setValue, setIsSyncing],
  );

  // Handle syncing status delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSyncing(false);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [content, setIsSyncing]);

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
        setValue('featureImageFile', file, { shouldDirty: true });
      }
      handleFileSelect(event);
    },
    [handleFileSelect, setValue],
  );

  const handleSelectImageFromLibrary = useCallback(
    (image: IImage | null) => {
      if (!image) return;
      setImageFromLibrary(image);
      setValue('featureImage', image.url, { shouldDirty: true });
    },
    [setValue],
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
                    {...register('imageCaption')}
                  />
                  <Button
                    onClick={() => {
                      if (featureImage) removePreview(featureImage.id);
                      if (storeFeatureImage) setValue('featureImage', '', { shouldDirty: true });
                      setValue('featureImageFile', null, { shouldDirty: true });
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
                      if (storeFeatureImage) setValue('featureImage', '', { shouldDirty: true });
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
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    titleRef.current = el;
                  }}
                  onChange={(e) => {
                    handleTitleResize();
                    field.onChange(e);
                  }}
                  className="min-w-full resize-none border-none px-0 text-4xl font-semibold text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:h-14 md:text-5xl dark:bg-transparent"
                  placeholder="Post title"
                  onPaste={(e) =>
                    handlePaste(e, {
                      onContentDetected: (detectedContent) => {
                        setValue('content', detectedContent, { shouldDirty: true });
                      },
                      onTitleDetected: (detectedTitle) => {
                        setValue('title', detectedTitle, { shouldDirty: true });
                        setValue('xMetaTitle', detectedTitle, { shouldDirty: true });
                        setValue('metaTitle', detectedTitle, { shouldDirty: true });
                        setTimeout(() => {
                          handleTitleResize();
                        }, 300);
                      },
                      onContentPlainTextDetected: (plainTextContent) => {
                        let metaDescription = plainTextContent.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
                        if (plainTextContent.length > 145) {
                          metaDescription = plainTextContent.slice(0, 142) + '...';
                        } else {
                          metaDescription = plainTextContent;
                        }
                        setValue('metaDescription', metaDescription, { shouldDirty: true });
                        setValue('xMetaDescription', metaDescription, { shouldDirty: true });
                        setValue('excerpt', metaDescription, { shouldDirty: true });
                      },
                    })
                  }
                />
              )}
            />
            {errors.title && <div className="text-sm text-destructive">{errors.title.message}</div>}
          </div>

          <div className="my-editor relative ml-9">
            <GhostLikeEditor content={content} onChange={handleContentChange} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Editor;
