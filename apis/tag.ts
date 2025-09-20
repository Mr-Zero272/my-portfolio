import axiosInstance from '@/lib/axios';
import { type ITag } from '@/models';
import { BasePaginationResponse, BaseResponse } from '@/types/response';

export const tagApi = {
  createTag: async ({ data }: { data: unknown }) => {
    const res = await axiosInstance.post<BaseResponse<ITag>>('/api/tags', data, {});
    return res.data;
  },

  updateTag: async ({ id, data }: { id: string; data: unknown }) => {
    const res = await axiosInstance.patch<BaseResponse<ITag>>(`/api/tags/${id}`, data, {});
    return res.data;
  },

  getTags: async ({ page = 1, limit = 12, type }: { page?: number; limit?: number; type?: string }) => {
    const res = await axiosInstance.get<BasePaginationResponse<ITag>>('/api/tags', {
      params: {
        page,
        limit,
        type,
      },
    });
    return res.data;
  },

  getTagById: async ({ id }: { id: string }) => {
    const res = await axiosInstance.get<BaseResponse<ITag>>(`/api/tags/${id}`, {});
    return res.data;
  },

  deleteTag: async ({ id }: { id: string }) => {
    const res = await axiosInstance.delete<BaseResponse<ITag>>(`/api/tags/${id}`, {});
    return res.data;
  },
};
