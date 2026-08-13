import { BaseQuery, RequestConfig } from '@/types/api';
import { UploadFromUrlInput } from '../schemas/gallery.schema';

export type GetGalleryImagesRequest = RequestConfig<
  undefined,
  BaseQuery<{
    mimeType?: string;
  }>,
  undefined
>;

export type GetGalleryImageRequest = RequestConfig<{ id: string }, undefined, undefined>;

export type UploadGalleryImageFromUrlInputRequest = RequestConfig<
  undefined,
  undefined,
  UploadFromUrlInput
>;

export type DeleteGalleryImageRequest = RequestConfig<{ id: string }, undefined, undefined>;
