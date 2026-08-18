'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GalleryPickerDialog } from '@/features/gallery/components/gallery-picker-dialog';
import { useDeleteGallery } from '@/features/gallery/hooks/mutations';
import type { GalleryImage } from '@/lib/generated/prisma/client';
import { uploadManager } from '@/lib/upload';
import { selectTasksByIds, useUploadStore } from '@/stores/upload';
import { BaseInputProps } from '@/types/form';
import { ImageIcon, PlusIcon, RotateCwIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

// ─── Types ──────────────────────────────────────────────────────────────────

interface GalleryItem {
  /** Key duy nhất — taskId (upload local) hoặc galleryImage.id (existing/picked). */
  key: string;
  /** Preview URL — blob (upload local) hoặc gallery url (existing/picked). */
  previewUrl: string;
  /** GalleryImage object khi là existing/picked. */
  galleryImage?: GalleryImage;
  /** taskId khi là upload local (đang theo dõi task trong upload store). */
  taskId?: string;
  /** true khi ảnh chọn từ gallery picker (dùng chung — không xóa khi remove). */
  pickedFromGallery: boolean;
}

interface FormGalleryInputProps extends BaseInputProps<string | string[]> {
  /** Multiple mode: the value is `string[]` (in the order of items). */
  multiple?: boolean;
  /** Context for the existing image to be used as a preview — similar to `featureImageFile` in PostFeatureImageInput. */
  existing?: GalleryImage | GalleryImage[] | null;
  /** Limit the number of photos (multiple mode). */
  maxFiles?: number;
  /** `accept` of input file (default "image/*"). */
  accept?: string;
  /** Title of the gallery picker dialog. */
  pickerTitle?: string;
  /** Delete the photo from the gallery upon removal (applies only to photos NOT picked from the gallery). */
  deleteOnRemove?: boolean;
  /** Skip image compression */
  skipCompression?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildInitialItems(
  existing: GalleryImage | GalleryImage[] | null | undefined,
  multiple: boolean,
): GalleryItem[] {
  const list = Array.isArray(existing) ? existing : existing ? [existing] : [];

  if (!multiple) {
    const first = list[0];
    return first
      ? [{ key: first.id, previewUrl: first.url, galleryImage: first, pickedFromGallery: false }]
      : [];
  }

  return list.map((image) => ({
    key: image.id,
    previewUrl: image.url,
    galleryImage: image,
    pickedFromGallery: false,
  }));
}

function getItemId(
  item: GalleryItem,
  taskFileIds: ReadonlyMap<string, string>,
): string | undefined {
  if (item.galleryImage) return item.galleryImage.id;
  if (item.taskId) return taskFileIds.get(item.taskId);
  return undefined;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function FormGalleryInput({
  optional,
  required,
  name,
  label,
  description,
  disabled,
  className,
  multiple = false,
  existing,
  maxFiles,
  accept = 'image/*',
  pickerTitle,
  deleteOnRemove = true,
  skipCompression,
}: FormGalleryInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className}>
          {label && (
            <FieldLabel required={required} optional={optional}>
              {label}
            </FieldLabel>
          )}
          <GalleryInputContent
            onChange={field.onChange}
            multiple={multiple}
            existing={existing}
            maxFiles={maxFiles}
            accept={accept}
            pickerTitle={pickerTitle}
            deleteOnRemove={deleteOnRemove}
            disabled={disabled}
            skipCompression={skipCompression}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}

// ─── Inner logic + UI (hooks con colocate trong cùng file) ──────────────────

function GalleryInputContent({
  onChange,
  multiple,
  existing,
  maxFiles,
  accept,
  pickerTitle,
  deleteOnRemove,
  disabled,
skipCompression
}: {
  onChange: (value: string | string[]) => void;
  multiple: boolean;
  existing?: GalleryImage | GalleryImage[] | null;
  maxFiles?: number;
  accept: string;
  pickerTitle?: string;
  deleteOnRemove: boolean;
    disabled?: boolean;
  skipCompression?: boolean
}) {
  const { mutate: deleteGallery } = useDeleteGallery();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  // items = nguồn preview (existing + picked + upload local). Seed 1 lần từ `existing`
  // (caller phải đảm bảo `existing` sẵn sàng lúc mount — giống PostFeatureImageInput).
  const [items, setItems] = useState<GalleryItem[]>(() => buildInitialItems(existing, multiple));

  // refs cho dữ liệu ngoài render (task result, blob urls)
  const taskFileIdsRef = useRef<Map<string, string>>(new Map());
  const writtenTaskIdsRef = useRef<Set<string>>(new Set());
  const blobUrlsRef = useRef<Set<string>>(new Set());

  const taskIds = useMemo(
    () => items.map((item) => item.taskId).filter((id): id is string => Boolean(id)),
    [items],
  );

  // Subscribe đúng các task của items — không theo dõi toàn bộ tasks Map
  const tasks = useUploadStore(useShallow(selectTasksByIds(taskIds)));

  const taskById = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);

  // ── Blob preview (tạo 1 lần, revoke khi thay/unmount) ──────────────────────
  const createBlobPreview = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.add(url);
    return url;
  }, []);

  const revokeBlobPreview = useCallback((url: string) => {
    if (!blobUrlsRef.current.has(url)) return;
    blobUrlsRef.current.delete(url);
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  // ── Ghi value vào form (single: string; multiple: string[]) ────────────────
  const writeValue = useCallback(
    (list: GalleryItem[]) => {
      const ids = list
        .map((item) => getItemId(item, taskFileIdsRef.current))
        .filter((id): id is string => Boolean(id));
      if (multiple) {
        onChange(ids);
      } else {
        onChange(ids[0] ?? '');
      }
    },
    [multiple, onChange],
  );

  // Upload thành công → ghi fileId vào form. KHÔNG setState trong effect
  // (tránh lint react-hooks/set-state-in-effect) — chỉ gọi field.onChange.
  useEffect(() => {
    let hasNewUpload = false;
    for (const task of tasks) {
      if (task.status === 'uploaded' && task.result?.fileId) {
        taskFileIdsRef.current.set(task.id, task.result.fileId);
        if (!writtenTaskIdsRef.current.has(task.id)) {
          writtenTaskIdsRef.current.add(task.id);
          hasNewUpload = true;
        }
      }
    }
    if (hasNewUpload) {
      writeValue(items);
    }
  }, [tasks, writeValue, items]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const canAdd = !maxFiles || items.length < maxFiles;

  const replaceWith = useCallback(
    (prevItem: GalleryItem | undefined, next: GalleryItem[]) => {
      if (prevItem?.taskId) uploadManager.cancel(prevItem.taskId);
      if (prevItem?.previewUrl.startsWith('blob:')) revokeBlobPreview(prevItem.previewUrl);
      setItems(next);
      writeValue(next);
    },
    [revokeBlobPreview, writeValue],
  );

  const addLocalFile = useCallback(
    (file: File) => {
      if (!canAdd) return;
      const previewUrl = createBlobPreview(file);
      const taskId = uploadManager.enqueue(file, {
        skipCompression: skipCompression,
      });
      const newItem: GalleryItem = {
        key: taskId,
        previewUrl,
        taskId,
        pickedFromGallery: false,
      };

      if (multiple) {
        setItems((prev) => [...prev, newItem]);
      } else {
        replaceWith(items[0], [newItem]);
      }
    },
    [canAdd, createBlobPreview, items, multiple, replaceWith, skipCompression],
  );

  const pickFromGallery = useCallback(
    (image: GalleryImage) => {
      if (!canAdd) return;
      const newItem: GalleryItem = {
        key: image.id,
        previewUrl: image.url,
        galleryImage: image,
        pickedFromGallery: true,
      };

      if (multiple) {
        const next = [...items, newItem];
        setItems(next);
        writeValue(next);
      } else {
        replaceWith(items[0], [newItem]);
      }
    },
    [canAdd, items, multiple, replaceWith, writeValue],
  );

  const removeItem = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (!item) return;

      if (item.taskId) uploadManager.cancel(item.taskId);

      // Xóa ảnh đã lưu trên gallery nếu không phải picked-from-gallery
      if (deleteOnRemove && !item.pickedFromGallery) {
        const id =
          item.galleryImage?.id ??
          (item.taskId ? taskFileIdsRef.current.get(item.taskId) : undefined);
        if (id) deleteGallery({ path: { id } });
      }

      if (item.previewUrl.startsWith('blob:')) revokeBlobPreview(item.previewUrl);

      const next = items.filter((i) => i.key !== key);
      setItems(next);
      writeValue(next);
    },
    [deleteGallery, deleteOnRemove, items, revokeBlobPreview, writeValue],
  );

  const retryTask = useCallback((taskId: string) => {
    uploadManager.retry(taskId);
  }, []);

  const getTaskState = useCallback(
    (item: GalleryItem) => {
      if (!item.taskId) return null;
      const task = taskById.get(item.taskId);
      if (!task) return null;
      return {
        isUploading: task.status === 'queued' || task.status === 'uploading',
        isRetrying: task.status === 'queued' && Boolean(task.error),
        hasFinalError: task.status === 'error' && task.retryCount >= task.maxRetries,
        errorMessage: task.error,
      };
    },
    [taskById],
  );

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      addLocalFile(file);
      // Reset input để chọn lại đúng file đó vẫn trigger onChange
      e.target.value = '';
    },
    [addLocalFile],
  );

  const sharedInput = (
    <>
      <input
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleSelectFile}
        ref={inputFileRef}
        disabled={disabled}
      />
      <GalleryPickerDialog
        open={galleryPickerOpen}
        onOpenChange={setGalleryPickerOpen}
        onSelect={pickFromGallery}
        title={pickerTitle ?? 'Pick image'}
      />
    </>
  );

  // ── Single mode ────────────────────────────────────────────────────────────
  if (!multiple) {
    const item = items[0];
    const taskState = item ? getTaskState(item) : null;

    return (
      <div className="flex flex-col gap-2">
        {item ? (
          <div className="space-y-2">
            <div className="relative overflow-hidden rounded-lg border">
              <Image
                src={item.previewUrl}
                alt="Image preview"
                width={1000}
                height={600}
                className="h-auto w-full object-cover"
                unoptimized
              />
              {!disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={() => removeItem(item.key)}
                  aria-label="Remove image"
                >
                  <XIcon />
                </Button>
              )}
            </div>

            {item.galleryImage && (
              <p className="text-muted-foreground text-sm">{item.galleryImage.name}</p>
            )}

            {taskState?.hasFinalError && (
              <div className="bg-destructive/10 border-destructive/30 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <TriangleAlertIcon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">
                  Upload failed: {taskState.errorMessage}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => item.taskId && retryTask(item.taskId)}
                >
                  <RotateCwIcon />
                  Retry
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || taskState?.isUploading}
                onClick={() => inputFileRef.current?.click()}
              >
                {taskState?.isUploading ? <Spinner /> : null}
                {taskState?.isUploading
                  ? taskState.isRetrying
                    ? 'Retrying...'
                    : 'Uploading...'
                  : 'Change image'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || taskState?.isUploading}
                onClick={() => setGalleryPickerOpen(true)}
              >
                <ImageIcon />
                Pick from gallery
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                className="text-destructive hover:text-destructive"
                onClick={() => removeItem(item.key)}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              disabled={disabled}
              onClick={() => inputFileRef.current?.click()}
            >
              <PlusIcon />
              Upload image
            </Button>

            <SeparatorDot />

            <Button
              type="button"
              variant="ghost"
              disabled={disabled}
              onClick={() => setGalleryPickerOpen(true)}
            >
              <ImageIcon />
              Pick from gallery
            </Button>
          </div>
        )}
        {sharedInput}
      </div>
    );
  }

  // ── Multiple mode ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => {
            const taskState = getTaskState(item);
            return (
              <div key={item.key} className="relative overflow-hidden rounded-lg border">
                <Image
                  src={item.previewUrl}
                  alt={item.galleryImage?.name ?? 'Image preview'}
                  width={400}
                  height={300}
                  className="h-auto w-full object-cover"
                  unoptimized
                />

                {taskState?.isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Spinner />
                  </div>
                )}

                {!disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.galleryImage?.name ?? 'image'}`}
                  >
                    <XIcon />
                  </Button>
                )}

                {taskState?.hasFinalError && (
                  <div className="bg-destructive/90 absolute inset-x-0 bottom-0 flex items-center gap-1 px-2 py-1 text-xs text-white">
                    <TriangleAlertIcon className="size-3 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">Upload failed</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white"
                      onClick={() => item.taskId && retryTask(item.taskId)}
                    >
                      <RotateCwIcon className="size-3" />
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          disabled={disabled || !canAdd}
          onClick={() => inputFileRef.current?.click()}
        >
          <PlusIcon />
          Upload image
        </Button>

        <SeparatorDot />

        <Button
          type="button"
          variant="ghost"
          disabled={disabled || !canAdd}
          onClick={() => setGalleryPickerOpen(true)}
        >
          <ImageIcon />
          Pick from gallery
        </Button>

        {maxFiles !== undefined && (
          <span className="text-muted-foreground ml-1 text-xs">
            {items.length}/{maxFiles}
          </span>
        )}
      </div>

      {sharedInput}
    </div>
  );
}

function SeparatorDot() {
  return (
    <span className="text-muted-foreground" aria-hidden>
      ·
    </span>
  );
}
