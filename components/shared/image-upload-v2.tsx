import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export type ImageUploadValue = string | File;

interface ImageUploadV2Props {
  value?: ImageUploadValue[];
  onChange?: (value: ImageUploadValue[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

const ImageUploadV2: React.FC<ImageUploadV2Props> = ({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
}) => {
  const [previews, setPreviews] = useState<{ url: string; isFile: boolean }[]>([]);

  // Generate previews for files and handle cleanup
  useEffect(() => {
    const newPreviews = value.map((item) => {
      if (item instanceof File) {
        return { url: URL.createObjectURL(item), isFile: true };
      }
      return { url: item, isFile: false };
    });

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.isFile) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return;

      let newFiles = acceptedFiles;

      if (!multiple) {
        // If not multiple, replace the current value with the new file
        newFiles = [acceptedFiles[0]];
        onChange?.(newFiles);
        return;
      }

      // If multiple, check limits
      const remainingSlots = maxFiles - value.length;
      if (remainingSlots <= 0) return;

      newFiles = newFiles.slice(0, remainingSlots);
      const newValue = [...value, ...newFiles];
      onChange?.(newValue);
    },
    [value, multiple, maxFiles, disabled, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxSize,
    disabled: disabled || (!multiple && value.length > 0),
    multiple,
  });

  const handleRemove = (index: number) => {
    if (disabled) return;
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
  };

  const hasItems = previews.length > 0;
  const isFull = !multiple && hasItems;

  return (
    <div className="w-full">
      {/* Drop Zone */}
      {!isFull && (
        <div
          {...getRootProps()}
          className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/50'
              : 'border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
        >
          <input {...getInputProps()} />

          {/* Background gradient effect */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5" />

          <div className="relative flex flex-col items-center justify-center px-4 py-12">
            <div className="mb-3 rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>

            <p className="mb-1 text-sm font-semibold text-slate-900">
              {isDragActive ? 'Drop files here' : 'Drag images here or click to select'}
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP – Up to {Math.round(maxSize / 1024 / 1024)}MB</p>
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {hasItems && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-slate-700">
            {multiple ? `${previews.length}/${maxFiles} images` : 'Selected Image'}
          </p>

          <div className={`grid gap-3 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'}`}>
            {previews.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-square w-full overflow-hidden rounded-lg border border-primary/20 bg-primary/5"
              >
                <img src={item.url} alt="preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all duration-200 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-transparent hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    type="button"
                  >
                    Remove
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadV2;
