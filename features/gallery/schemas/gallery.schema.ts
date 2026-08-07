import { z } from 'zod';

export const getPresignedUrlSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('Size must be a positive integer'),
  caption: z.string().optional(),
});

export type GetPresignedUrlInput = z.infer<typeof getPresignedUrlSchema>;

export const confirmUploadSchema = z.object({
  fileId: z.string().min(1, 'File ID is required'),
  key: z.string().min(1, 'Object key is required'),
  name: z.string().min(1, 'File name is required'),
  size: z.number().int().positive('Size must be a positive integer'),
  mimeType: z.string().min(1, 'MIME type is required'),
  caption: z.string().optional(),
});

export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;

export const uploadFromUrlSchema = z.object({
  url: z.url('Invalid image URL'),
  name: z.string().optional(),
  caption: z.string().optional(),
});

export type UploadFromUrlInput = z.infer<typeof uploadFromUrlSchema>;
