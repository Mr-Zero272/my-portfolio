import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { generateReactHelpers, generateUploadButton, generateUploadDropzone } from '@uploadthing/react';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Helper function to upload a single file
export async function uploadFile(file: File, endpoint: keyof OurFileRouter = 'mediaUploader') {
  try {
    const result = await uploadFiles(endpoint, {
      files: [file],
    });

    if (result && result[0]) {
      return {
        data: {
          url: result[0].ufsUrl,
        },
        success: true,
      };
    }

    throw new Error('Upload failed');
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Helper function to upload multiple files
export async function uploadMultipleFiles(files: File[], endpoint: keyof OurFileRouter = 'mediaUploader') {
  try {
    const result = await uploadFiles(endpoint, {
      files,
    });

    if (result && result.length > 0) {
      return result.map((file) => ({
        src: file.ufsUrl,
        alt: file.name,
      }));
    }

    throw new Error('Upload failed');
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Hook wrapper for easier usage
export function useFileUpload(endpoint: keyof OurFileRouter = 'mediaUploader') {
  const { startUpload, isUploading } = useUploadThing(endpoint);

  const uploadSingleFile = async (file: File) => {
    try {
      const result = await startUpload([file]);

      if (result && result[0]) {
        return {
          data: {
            url: result[0].ufsUrl,
          },
          success: true,
        };
      }

      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const uploadMultiple = async (files: File[]) => {
    try {
      const result = await startUpload(files);

      if (result && result.length > 0) {
        return result.map((file) => ({
          src: file.ufsUrl,
          alt: file.name,
        }));
      }

      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  return {
    uploadSingleFile,
    uploadMultiple,
    isUploading,
  };
}
