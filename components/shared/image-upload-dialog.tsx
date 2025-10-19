'use client';

import ImageUpload from '@/components/shared/image-upload';
import { AnimatedButton } from '@/components/ui/animated-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ImagePlus, Upload } from 'lucide-react';
import { useState } from 'react';

interface ImageUploadDialogProps {
  onImagesSelected?: (images: File[]) => void;
  maxFiles?: number;
  trigger?: React.ReactNode;
  disabled?: boolean;
}

export default function ImageUploadDialog({
  onImagesSelected,
  maxFiles = 5,
  trigger,
  disabled = false,
}: ImageUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleImagesChange = (images: File[]) => {
    setSelectedImages(images);
  };

  const handleConfirm = () => {
    onImagesSelected?.(selectedImages);
    setOpen(false);
    setSelectedImages([]);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedImages([]);
  };

  const defaultTrigger = (
    <AnimatedButton variant="ghost" title="Upload Images" disabled={disabled} tabIndex={-1}>
      <ImagePlus size={18} strokeWidth={2.5} />
    </AnimatedButton>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={20} />
            Upload Images
          </DialogTitle>
          <DialogDescription>
            Select up to {maxFiles} images to upload. Supported formats: PNG, JPG, GIF, WebP.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ImageUpload
            onImagesChange={handleImagesChange}
            maxFiles={maxFiles}
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <AnimatedButton variant="outline" onClick={handleCancel}>
            Cancel
          </AnimatedButton>
          <AnimatedButton onClick={handleConfirm} disabled={selectedImages.length === 0}>
            Add {selectedImages.length > 0 ? `${selectedImages.length} ` : ''}Images
          </AnimatedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
