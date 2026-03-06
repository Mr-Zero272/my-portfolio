import * as React from 'react';

import type { OurFileRouter } from '@/app/api/uploadthing/core';
import type { ClientUploadedFileData, UploadFilesOptions } from 'uploadthing/types';

import { generateReactHelpers } from '@uploadthing/react';
import { toast } from 'sonner';
import { z } from 'zod';

export type UploadedFile<T = unknown> = ClientUploadedFileData<T>;

interface UseUploadFileProps extends Pick<
  UploadFilesOptions<OurFileRouter['editorUploader']>,
  'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'
> {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  saveToDb?: boolean; // Option để lưu ảnh vào database
  userCreated?: string; // User ID để lưu vào database
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  saveToDb = false,
  userCreated,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const res = await uploadFiles('editorUploader', {
        ...props,
        files: [file],
        onUploadProgress: ({ progress }) => {
          setProgress(Math.min(progress, 100));
        },
      });

      const uploadedFileData = res[0];
      setUploadedFile(uploadedFileData);

      // Lưu ảnh vào database nếu được yêu cầu
      if (saveToDb && userCreated && uploadedFileData.url) {
        try {
          const imageData = {
            url: uploadedFileData.ufsUrl,
            name: uploadedFileData.name,
            size: uploadedFileData.size,
            mineType: file.type,
            userCreated,
          };

          const response = await fetch('/api/images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageData),
          });

          if (response.ok) {
            const savedImage = await response.json();
            console.log('Image saved to database:', savedImage);
          } else {
            console.warn('Failed to save image to database, but upload was successful');
          }
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Không throw error để không ảnh hưởng đến quá trình upload
        }
      }

      onUploadComplete?.(uploadedFileData);

      return uploadedFileData;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message = errorMessage.length > 0 ? errorMessage : 'Something went wrong, please try again later.';

      toast.error(message);

      onUploadError?.(error);

      // Mock upload for unauthenticated users
      // toast.info('User not logged in. Mocking upload process.');
      const mockUploadedFile = {
        key: 'mock-key-0',
        appUrl: `https://mock-app-url.com/${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      } as UploadedFile;

      // Simulate upload progress
      let progress = 0;

      const simulateProgress = async () => {
        while (progress < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          progress += 2;
          setProgress(Math.min(progress, 100));
        }
      };

      await simulateProgress();

      setUploadedFile(mockUploadedFile);

      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadThing,
    uploadingFile,
  };
}

export const { uploadFiles, useUploadThing } = generateReactHelpers<OurFileRouter>();

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);

    return errors.join('\n');
  }
  if (err instanceof Error) {
    return err.message;
  }
  return unknownError;
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
