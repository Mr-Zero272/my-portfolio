'use client';

import ImageUpload from '@/components/shared/image-upload';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { uploadImageWithDB } from '@/lib/uploadthing';
import { cn } from '@/lib/utils';
import { CheckCircle2, ImagePlus, Loader2, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GalleryUploadDialogProps {
  onUploadComplete?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number; // 0-100 (fake progress for individual files if needed, or just status)
  error?: string;
}

export default function GalleryUploadDialog({
  onUploadComplete,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: GalleryUploadDialogProps) {
  const { data: session } = useSession();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      setControlledOpen?.(val);
    } else {
      setInternalOpen(val);
    }
  };
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<FileUploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleImagesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    // Reset statuses when files change
    setUploadStatuses(
      newFiles.map((file) => ({
        file,
        status: 'pending',
        progress: 0,
      })),
    );
    setOverallProgress(0);
  };

  const handleUpload = async () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to upload images');
      return;
    }

    if (files.length === 0) return;

    setIsUploading(true);
    setOverallProgress(0);

    let completedCount = 0;
    const totalFiles = files.length;

    // Process files one by one or in parallel?
    // Parallel is better for UX, but we need to track progress carefully.
    // Let's do parallel with a limit if needed, but for now simple Promise.all is fine
    // or just map since we want to update individual status.

    const uploadPromises = files.map(async (file, index) => {
      // Update status to uploading
      setUploadStatuses((prev) => prev.map((s, i) => (i === index ? { ...s, status: 'uploading', progress: 10 } : s)));

      try {
        // Simulate progress for better UX (since uploadthing doesn't give granular progress per file easily in this helper)
        const progressInterval = setInterval(() => {
          setUploadStatuses((prev) =>
            prev.map((s, i) => {
              if (i === index && s.status === 'uploading') {
                return { ...s, progress: Math.min(s.progress + 10, 90) };
              }
              return s;
            }),
          );
        }, 500);

        await uploadImageWithDB(file, session.user.id as string);

        clearInterval(progressInterval);

        // Update status to success
        setUploadStatuses((prev) => prev.map((s, i) => (i === index ? { ...s, status: 'success', progress: 100 } : s)));
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        // Update status to error
        setUploadStatuses((prev) =>
          prev.map((s, i) => (i === index ? { ...s, status: 'error', error: 'Upload failed' } : s)),
        );
      } finally {
        completedCount++;
        setOverallProgress(Math.round((completedCount / totalFiles) * 100));
      }
    });

    await Promise.all(uploadPromises);

    setIsUploading(false);

    // Check if all succeeded
    const allSuccess = uploadStatuses.every((s) => s.status !== 'error'); // Note: state update inside async might not be reflected immediately in local var, but we can check completedCount
    // Actually, we should check the final state.
    // But since we await Promise.all, we know all are done.

    if (completedCount === totalFiles) {
      toast.success(`Uploaded ${completedCount} images`);
      onUploadComplete?.();
      // Optional: Close dialog after a delay if all success
      // setTimeout(() => setOpen(false), 1000);
    }
  };

  const handleCancel = () => {
    if (isUploading) return;
    setOpen(false);
    setFiles([]);
    setUploadStatuses([]);
    setOverallProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isUploading && setOpen(val)}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus size={20} />
            Upload to Gallery
          </DialogTitle>
          <DialogDescription>Add new images to your gallery. Supported formats: PNG, JPG, GIF, WebP.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Selection */}
          <div className={cn(isUploading && 'pointer-events-none opacity-50')}>
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxFiles={10}
              maxSize={10 * 1024 * 1024} // 10MB
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress Area */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Upload Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />

                {/* Individual File Status */}
                <div className="grid max-h-[200px] gap-2 overflow-y-auto rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
                  {uploadStatuses.map((status, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-white p-2 shadow-sm dark:bg-slate-800"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                          {status.status === 'pending' && <div className="h-2 w-2 rounded-full bg-slate-400" />}
                          {status.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {status.status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {status.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate text-sm font-medium">{status.file.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {(status.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status.status === 'error' && <span className="text-xs text-red-500">{status.error}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <AnimatedButton
            onClick={handleUpload}
            disabled={
              files.length === 0 ||
              isUploading ||
              (uploadStatuses.length > 0 && uploadStatuses.every((s) => s.status === 'success'))
            }
          >
            {isUploading
              ? 'Uploading...'
              : uploadStatuses.every((s) => s.status === 'success') && files.length > 0
                ? 'Done'
                : 'Start Upload'}
          </AnimatedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
