'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export const FileUpload = ({
  title = 'Upload image',
  onChange,
  onRemove,
  className = '',
  previewUrl,
  isDisplayFileInfo = true,
  buttonClassName = '',
  imagePreviewClassName = '',
  fileSize = MAX_IMAGE_SIZE,
  multiple = false,
}: {
  title?: string;
  onChange?: (files: File | File[] | null) => void;
  onRemove?: () => void;
  className?: string;
  previewUrl?: string | File | File[];
  isDisplayFileInfo?: boolean;
  buttonClassName?: string;
  imagePreviewClassName?: string;
  fileSize?: number; // in bytes, default is 5MB
  multiple?: boolean;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize previews from previewUrl
  useEffect(() => {
    if (previewUrl) {
      if (typeof previewUrl === 'string') {
        setPreviews([previewUrl]);
      } else if (Array.isArray(previewUrl)) {
        // Handle array of files
        const handleFiles = async () => {
          const newPreviews: string[] = [];
          for (const file of previewUrl) {
            if (typeof file === 'string') {
              newPreviews.push(file);
            } else {
              const reader = new FileReader();
              const preview = await new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              });
              newPreviews.push(preview);
            }
          }
          setPreviews(newPreviews);
          setFiles(previewUrl.filter((f) => f instanceof File) as File[]);
        };
        handleFiles();
      } else {
        // Single file
        const reader = new FileReader();
        reader.onload = (e) => setPreviews([e.target?.result as string]);
        reader.readAsDataURL(previewUrl as File);
        setFiles([previewUrl as File]);
      }
    }
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (newFiles: File[]) => {
      // Clear previous error
      setError(null);

      // valid size check
      if (newFiles.length === 0) {
        setError('No files selected');
        return;
      }

      // Filter and validate files
      const validFiles: File[] = [];

      for (const file of newFiles) {
        // Check file size
        if (file.size > fileSize) {
          setError(`File ${file.name} is too large. Max size is ${fileSize / (1024 * 1024)} MB.`);
          continue;
        }

        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          setError(`File ${file.name} is not a valid image.`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        return;
      }

      // For single mode, only take the first file
      const filesToProcess = multiple ? validFiles : [validFiles[0]];

      // Set uploading state to true
      setIsUploading(true);

      // Create previews for the selected files
      Promise.all(
        filesToProcess.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => reject('Failed to load image');
            reader.readAsDataURL(file);
          });
        }),
      )
        .then((previews) => {
          setPreviews(previews);
          setFiles(filesToProcess);
          setIsUploading(false);

          // Call onChange with appropriate format
          if (multiple) {
            onChange?.(filesToProcess);
          } else {
            onChange?.(filesToProcess[0] || null);
          }
        })
        .catch(() => {
          setError('Failed to load images');
          setIsUploading(false);
        });
    },
    [onChange, fileSize, multiple],
  );

  useEffect(() => {
    if (previewUrl) {
      if (typeof previewUrl === 'string') {
        setPreviews([previewUrl]);
      } else if (Array.isArray(previewUrl)) {
        // Handle array of files
        const handleFiles = async () => {
          const newPreviews: string[] = [];
          for (const file of previewUrl) {
            if (typeof file === 'string') {
              newPreviews.push(file);
            } else {
              const reader = new FileReader();
              const preview = await new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              });
              newPreviews.push(preview);
            }
          }
          setPreviews(newPreviews);
          setFiles(previewUrl.filter((f) => f instanceof File) as File[]);
        };
        handleFiles();
      } else {
        // Single file
        const reader = new FileReader();
        reader.onload = (e) => setPreviews([e.target?.result as string]);
        reader.readAsDataURL(previewUrl as File);
        setFiles([previewUrl as File]);
      }
    }
  }, [previewUrl]);

  const removeFile = (index?: number) => {
    if (multiple && index !== undefined) {
      // Remove specific file in multiple mode
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      setFiles(newFiles);
      setPreviews(newPreviews);
      setError(null);
      onChange?.(newFiles.length > 0 ? newFiles : null);
    } else {
      // Remove all files
      setFiles([]);
      setPreviews([]);
      setError(null);
      onChange?.(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const { getRootProps, isDragActive } = useDropzone({
    multiple: multiple,
    noClick: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
    },
    maxSize: fileSize,
    onDrop: handleFileChange,
    onDropRejected: (rejectedFiles) => {
      // console.log("Rejected files:", rejectedFiles);
      const reasons = rejectedFiles.map((file) => file.errors[0]?.message).join(', ');
      setError(`File rejected: ${reasons}`);
    },
  });
  return (
    <div
      className={cn(
        'group max-h-96 w-full rounded-lg bg-[#f1f3f4] dark:bg-[#394047] dark:hover:bg-[#2e3338]',
        className,
      )}
      {...getRootProps()}
    >
      {previews.length > 0 && (
        // Preview container
        <div className="relative w-full">
          {multiple ? (
            // Multiple files grid
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-[#394047]">
                  <Image
                    src={preview}
                    alt={files[index]?.name || `Preview image ${index + 1}`}
                    className={cn('h-24 w-full object-cover', imagePreviewClassName)}
                    width={200}
                    height={200}
                  />
                  {/* Delete button overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                      onRemove?.();
                    }}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                  >
                    <Trash2 className="size-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Single file preview
            <div className="relative w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-[#394047] dark:hover:bg-[#2e3338]">
              <Image
                src={previews[0]}
                alt={files[0]?.name || 'Preview image'}
                className={cn('min-20 h-auto max-h-60 w-full object-contain', imagePreviewClassName)}
                width={500}
                height={500}
                unoptimized={true}
              />
              {/* Delete button overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                  onRemove?.();
                }}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                <Trash2 className="size-4 text-white" />
              </button>
            </div>
          )}

          {/* File info */}
          {files.length > 0 && isDisplayFileInfo && (
            <div className="mt-3 text-center">
              {multiple ? (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(files.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{files[0]?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(files[0]?.size / (1024 * 1024)).toFixed(2)} MB • {files[0]?.type}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {previews.length === 0 && (
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className={cn(
            'group/file relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg p-10',
            className,
          )}
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
            accept="image/*"
            multiple={multiple}
          />

          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <p className="text-sm text-gray-500">Uploading</p>
              </div>
            ) : !error ? (
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'border-none shadow-none hover:bg-white hover:text-black dark:bg-[#17191c] dark:hover:bg-[#17191c] dark:hover:text-white',
                  buttonClassName,
                )}
              >
                {isDragActive ? 'Drop the files here' : title}
              </Button>
            ) : (
              <p className="relative z-20 mt-2 font-sans text-base font-normal text-red-500">{error}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
