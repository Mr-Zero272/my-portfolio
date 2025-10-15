import axiosInstance from '@/lib/axios';
import { type IImage } from '@/models';
import { BaseResponse } from '@/types/response';

export const imageApi = {
  createImage: async ({ data }: { data: unknown }) => {
    const res = await axiosInstance.post<BaseResponse<IImage>>('/api/images', data, {});
    return res.data;
  },

  updateImage: async ({ id, data }: { id: string; data: unknown }) => {
    const res = await axiosInstance.put<BaseResponse<IImage>>(`/api/images/${id}`, data, {});
    return res.data;
  },

  getImages: async ({
    page = 1,
    limit = 12,
    userCreated,
    search,
  }: {
    page?: number;
    limit?: number;
    userCreated?: string;
    search?: string;
  } = {}) => {
    const res = await axiosInstance.get<{ images: IImage[]; total: number; totalPages: number }>('/api/images', {
      params: {
        page,
        limit,
        userCreated,
        search,
      },
    });
    return res.data;
  },

  getImageById: async ({ id }: { id: string }) => {
    const res = await axiosInstance.get<BaseResponse<IImage>>(`/api/images/${id}`, {});
    return res.data;
  },

  deleteImage: async ({ id }: { id: string }) => {
    const res = await axiosInstance.delete<BaseResponse<{ message: string }>>(`/api/images/${id}`, {});
    return res.data;
  },

  getImagesByUser: async ({ userId, page = 1, limit = 12 }: { userId: string; page?: number; limit?: number }) => {
    const res = await axiosInstance.get<{ images: IImage[]; total: number; totalPages: number }>(
      `/api/images/user/${userId}`,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return res.data;
  },

  searchImages: async ({
    query,
    page = 1,
    limit = 12,
    userCreated,
  }: {
    query: string;
    page?: number;
    limit?: number;
    userCreated?: string;
  }) => {
    const res = await axiosInstance.get<{ images: IImage[]; total: number; totalPages: number }>('/api/images/search', {
      params: {
        q: query,
        page,
        limit,
        userCreated,
      },
    });
    return res.data;
  },
};
