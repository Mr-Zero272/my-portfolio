'use client';

import { cn } from '@/lib/utils';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImagesChange?: (images: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImagesChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.slice(0, maxFiles - uploadedImages.length);
      const allImages = [...uploadedImages, ...newImages];

      setUploadedImages(allImages);
      onImagesChange?.(allImages);

      // Create preview URLs
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [uploadedImages, maxFiles, onImagesChange],
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      onImagesChange?.(newImages);

      // Revoke URL to prevent memory leaks
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [uploadedImages, previews, onImagesChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize,
    maxFiles: maxFiles - uploadedImages.length,
    disabled,
  });

  const hasError = isDragReject || fileRejections.length > 0;

  return (
    <div className={cn('w-full', className)}>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragActive && !hasError && 'border-primary bg-primary/5',
          hasError && 'border-red-500 bg-red-50',
          !isDragActive && !hasError && 'border-gray-300 hover:border-gray-400',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <input {...getInputProps()} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} transition={{ duration: 0.2 }}>
            <Upload
              className={cn(
                'mx-auto mb-4 h-12 w-12',
                isDragActive && !hasError ? 'text-primary' : 'text-gray-400',
                hasError && 'text-red-500',
              )}
            />
          </motion.div>

          <div className="space-y-2">
            <p className={cn('text-lg font-medium', hasError ? 'text-red-600' : 'text-gray-900')}>
              {isDragActive ? (hasError ? 'Invalid file type' : 'Drop images here') : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500">or click to select files</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB</p>
          </div>
        </motion.div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {fileRejections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1"
          >
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="text-sm text-red-600">
                {file.name}: {errors.map((e) => e.message).join(', ')}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Images */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4"
          >
            {/* Mobile: Single column with horizontal scroll, Desktop: Grid layout */}
            <div className="block sm:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previews.map((preview, index) => (
                  <motion.div
                    key={preview}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative flex-shrink-0"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                      <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />

                      {/* Remove Button - Always visible on mobile */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(index)}
                        className="absolute top-0.5 right-0.5 z-10 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
                      >
                        <X size={12} />
                      </motion.button>
                    </div>

                    {/* File Info */}
                    <div className="mt-1 w-24 truncate text-xs text-gray-500">{uploadedImages[index]?.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
                {previews.map((preview, index) => (
                  <motion.div
                    key={preview}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />

                      {/* Hover Overlay - Only show on hover, behind remove button */}
                      <div className="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 flex items-center justify-center transition-all duration-200">
                        <ImageIcon
                          className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-50"
                          size={20}
                        />
                      </div>

                      {/* Remove Button - Higher z-index to be above overlay */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1.5 text-white opacity-80 shadow-lg transition-all duration-200 group-hover:opacity-100 hover:bg-red-600"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>

                    {/* File Info */}
                    <div className="mt-2 truncate text-xs text-gray-500">{uploadedImages[index]?.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upload Stats */}
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
              <span>
                {uploadedImages.length} of {maxFiles} images selected
              </span>
              {uploadedImages.length > 0 && (
                <span className="text-xs">
                  {previews.length > 3 && <span className="sm:hidden">Swipe to see more →</span>}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
