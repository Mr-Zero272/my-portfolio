'use client';

import { FormInput } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { GalleryPickerDialog } from '@/features/gallery/components/gallery-picker-dialog';
import { useDeleteGallery } from '@/features/gallery/hooks/mutations';
import { GalleryImage } from '@/lib/generated/prisma/client';
import { uploadManager } from '@/lib/upload';
import { selectTaskById, useUploadStore } from '@/stores/upload';
import { ImageIcon, PlusIcon, RotateCwIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const PostFeatureImageInput = ({
  featureImageFile,
}: {
  featureImageFile?: GalleryImage | null;
}) => {
  const { mutate: deleteGallery } = useDeleteGallery();
  const { setValue } = useFormContext();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [imageFeatureFile, setImageFeatureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => featureImageFile?.url ?? null);
  const [taskId, setTaskId] = useState<string | null>(null);
  // When true, the current preview came from the gallery picker (not a new upload)
  const [pickedFromGallery, setPickedFromGallery] = useState(false);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  // Blob URL được tạo 1 lần khi chọn file, revoke khi thay thế/unmount
  // → không còn tạo object URL mới mỗi lần render (tránh rò rỉ bộ nhớ)
  const blobUrlRef = useRef<string | null>(null);

  // Subscribe đúng task upload của input này qua selectTaskById — không bị
  // re-render khi có upload khác ở nơi khác trong app
  const task = useUploadStore(selectTaskById(taskId ?? ''));

  const isUploading = task?.status === 'queued' || task?.status === 'uploading';
  const isRetrying = task?.status === 'queued' && Boolean(task.error);
  // Đã auto-retry hết lượt mà vẫn lỗi → cần xử lý thủ công
  const hasFinalError = task?.status === 'error' && task.retryCount >= task.maxRetries;

  const revokeBlobPreview = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const handleSelectFeatureImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    revokeBlobPreview();
    const url = URL.createObjectURL(file);
    blobUrlRef.current = url;

    setImageFeatureFile(file);
    setPreviewUrl(url);
    setTaskId(uploadManager.enqueue(file));
    setPickedFromGallery(false);

    // Reset input để chọn lại đúng file đó vẫn trigger onChange
    e.target.value = '';
  };

  // ── Gallery picker ────────────────────────────────────────────────────────
  const handlePickFromGallery = (imageOrImages: GalleryImage | GalleryImage[]) => {
    const image = Array.isArray(imageOrImages) ? imageOrImages[0] : imageOrImages;
    if (!image) return;

    // Cancel any in-progress upload
    if (task) uploadManager.cancel(task.id);
    revokeBlobPreview();

    setImageFeatureFile(null);
    setTaskId(null);
    setPreviewUrl(image.url);
    setPickedFromGallery(true);

    setValue('featureImageId', image.id, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Upload thành công: chỉ cần ghi fileId vào form, preview giữ nguyên blob local
  useEffect(() => {
    if (task?.status !== 'uploaded' || !task.result?.fileId) return;

    setValue('featureImageId', task.result.fileId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [task?.status, task?.result?.fileId, setValue]);

  // Dọn blob URL khi unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleRemoveImage = () => {
    if (task) uploadManager.cancel(task.id);
    // Xóa ảnh đã lưu trên gallery (ảnh cũ của post) khi remove khỏi form
    // nhưng KHÔNG xóa ảnh từ gallery picker (vì ảnh đó được dùng chung)
    if (featureImageFile && !pickedFromGallery) {
      deleteGallery({ path: { id: featureImageFile.id } });
    }
    revokeBlobPreview();
    setImageFeatureFile(null);
    setPreviewUrl(null);
    setTaskId(null);
    setPickedFromGallery(false);
    setValue('featureImageId', '', { shouldDirty: true });
  };

  const handleRetry = () => {
    if (task) uploadManager.retry(task.id);
  };

  const hasImage = Boolean(imageFeatureFile || previewUrl);

  return (
    <div className="md:px-20">
      {hasImage ? (
        <div className="mb-4">
          <div className="relative inline-block w-full rounded-lg">
            <Image
              src={previewUrl || ''}
              alt="Feature image preview"
              width={1000}
              height={600}
              className="h-auto max-w-full rounded-lg object-cover"
              unoptimized
            />
            {/* Image caption */}
            <FormInput
              name="imageCaption"
              className="bg-accent mx-0 mt-1 border-none shadow-none outline-0 focus-visible:bg-transparent focus-visible:ring-0"
              placeholder="Image caption"
            />
            <Button
              onClick={handleRemoveImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 cursor-pointer"
            >
              <XIcon />
            </Button>
          </div>

          {featureImageFile && !imageFeatureFile && (
            <div className="text-muted-foreground mt-2 text-sm">
              Feature image: {featureImageFile.name}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <Button
              onClick={() => inputFileRef.current?.click()}
              variant="outline"
              size="sm"
              disabled={isUploading}
            >
              Change image
            </Button>
            <Button
              onClick={() => setGalleryPickerOpen(true)}
              variant="outline"
              size="sm"
              disabled={isUploading}
            >
              <ImageIcon />
              Pick from gallery
            </Button>
            <Button
              onClick={handleRemoveImage}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>

          {hasFinalError && (
            <div className="bg-destructive/10 border-destructive/30 text-destructive mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <TriangleAlertIcon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">Upload failed: {task?.error}</span>
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RotateCwIcon />
                Retry
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Button
            onClick={() => inputFileRef.current?.click()}
            variant="ghost"
            disabled={isUploading}
          >
            {isUploading ? <Spinner /> : <PlusIcon />}
            {isUploading ? (isRetrying ? 'Retrying...' : 'Uploading...') : 'Upload feature image'}
          </Button>

          <Separator orientation="vertical" className="h-5" />

          <Button
            onClick={() => setGalleryPickerOpen(true)}
            variant="ghost"
            disabled={isUploading}
          >
            <ImageIcon />
            Pick from gallery
          </Button>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleSelectFeatureImage}
        ref={inputFileRef}
      />

      <GalleryPickerDialog
        open={galleryPickerOpen}
        onOpenChange={setGalleryPickerOpen}
        onSelect={handlePickFromGallery}
        title="Pick feature image"
      />
    </div>
  );
};

