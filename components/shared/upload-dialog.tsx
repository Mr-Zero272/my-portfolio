'use client';

import { useCallback, useMemo, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/format';
import { cn } from '@/lib/utils';
import { FileTextIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '../ui/responsive-dialog';

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const DEFAULT_ACCEPTED_TYPES = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  // 'application/pdf': ['.pdf'],
  // 'application/zip': ['.zip', '.gz', '.rar', '.7z'],
  // 'application/msword': ['.doc'],
  // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  // 'application/vnd.ms-excel': ['.xls'],
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  // 'text/*': ['.txt', '.csv', '.md', '.json', '.xml']
} as const;

// ─── Props ──────────────────────────────────────────────────────────────────

interface FileUploadBlockProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Được gọi khi người dùng bấm submit, nhận danh sách file đang pending. */
  onSubmit: (files: File[]) => void;
  /** Cho phép caller reset lại pending list sau khi submit thành công/thất bại. */
  onFilesChange?: (files: File[]) => void;
  maxFileSize?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
  submitLabel?: string;
}

// ─── Main ───────────────────────────────────────────────────────────────────

export function UploadAreaDialog({
  open,
  onOpenChange,
  onSubmit,
  onFilesChange,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  accept = DEFAULT_ACCEPTED_TYPES as unknown as Record<string, string[]>,
  multiple = true,
  disabled = false,
  submitLabel = 'Upload',
}: FileUploadBlockProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const updatePendingFiles = useCallback(
    (updater: (prev: File[]) => File[]) => {
      setPendingFiles((prev) => {
        const next = updater(prev);
        onFilesChange?.(next);
        return next;
      });
    },
    [onFilesChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const rejectionSummary = new Map<string, number>();

      fileRejections.forEach(({ errors }) => {
        const uniqueCodes = new Set(errors.map((e) => e.code));

        uniqueCodes.forEach((code) => {
          rejectionSummary.set(code, (rejectionSummary.get(code) ?? 0) + 1);
        });
      });

      const parts: string[] = [];
      if (rejectionSummary.has('file-too-large')) {
        parts.push(
          `${rejectionSummary.get('file-too-large')} file${rejectionSummary.get('file-too-large') === 1 ? '' : 's'} too large (> ${formatFileSize(DEFAULT_MAX_FILE_SIZE)})`,
        );
      }

      if (rejectionSummary.has('file-invalid-type')) {
        parts.push(
          `${rejectionSummary.get('file-invalid-type')} file${rejectionSummary.get('file-invalid-type') === 1 ? '' : 's'} invalid type`,
        );
      }

      if (parts.length > 0) {
        toast.error('Some files were rejected.', {
          description: parts.join(', '),
        });
      }

      updatePendingFiles((prev) => [...prev, ...acceptedFiles]);
    },
    [updatePendingFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: maxFileSize,
    accept,
    disabled,
  });

  const removeFile = useCallback(
    (index: number) => {
      updatePendingFiles((prev) => prev.filter((_, i) => i !== index));
    },
    [updatePendingFiles],
  );

  // const clearAll = useCallback(() => {
  //   updatePendingFiles(() => []);
  // }, [updatePendingFiles]);

  const handleSubmit = useCallback(() => {
    if (pendingFiles.length === 0) return;
    onSubmit(pendingFiles);
    updatePendingFiles(() => []);
    onOpenChange(false);
  }, [pendingFiles, onSubmit, updatePendingFiles, onOpenChange]);

  const totalSize = useMemo(() => pendingFiles.reduce((sum, f) => sum + f.size, 0), [pendingFiles]);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Upload Files</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Drag and drop or select files to upload.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {/* ── Dropzone ────────────────────────────────────────────── */}
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50',
          )}
        >
          <input {...getInputProps()} />
          <UploadCloudIcon className="text-muted-foreground mb-2 size-8" />
          <p className="text-sm font-medium">
            {isDragActive ? 'Drop files here' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">Max 5 MB per file</p>
        </div>

        {/* ── Pending files ───────────────────────────────────────── */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            {pendingFiles.map((file, index) => (
              <Attachment key={`${file.name}-${index}`} state="idle" className="w-full">
                <AttachmentMedia>
                  <FileTextIcon className="size-5" />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>{formatFileSize(file.size)}</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    onClick={() => removeFile(index)}
                  >
                    <XIcon className="size-4" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </div>
        )}

        <ResponsiveDialogFooter>
          <div className="text-muted-foreground mr-auto text-xs">
            {pendingFiles.length > 0 &&
              `${pendingFiles.length} file${pendingFiles.length > 1 ? 's' : ''} · ${formatFileSize(totalSize)}`}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pendingFiles.length === 0}>
            {submitLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
