import { DeleteTagRequest } from '@/features/tags/types';
import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import { GalleryImage } from '@prisma/client';
import {
    GetGalleryImageRequest,
    GetGalleryImagesRequest,
    UploadGalleryImageFromUrlInputRequest,
} from '../types';

export const galleryApi = {
  getAll: async (request?: GetGalleryImagesRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/gallery', { params: queryParams });
    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<GalleryImage>;
  },

  getById: async (request: GetGalleryImageRequest) => {
    const res = await axiosInstance.get(`/gallery/${request.path?.id}`);

    return res.data.data as GalleryImage;
  },

  uploadByUrl: async (request: UploadGalleryImageFromUrlInputRequest) => {
    const res = await axiosInstance.post('/gallery/upload/from-url', request.body);

    return res.data.data as GalleryImage;
  },

  delete: async (request: DeleteTagRequest) => {
    const res = await axiosInstance.delete(`/gallery/${request.path?.id}`);

    return res.data.data as GalleryImage;
  },
};
