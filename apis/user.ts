import axiosInstance from '@/lib/axios';
import { type IUser } from '@/models';
import { BasePaginationResponse, BaseResponse } from '@/types/response';

export const userApi = {
  createUser: async ({ data }: { data: unknown }) => {
    const res = await axiosInstance.post<BaseResponse<IUser>>('/api/users', data, {});
    return res.data;
  },

  updateUser: async ({ id, data }: { id: string; data: unknown }) => {
    const res = await axiosInstance.patch<BaseResponse<IUser>>(`/api/users/${id}`, data, {});
    return res.data;
  },

  getUsers: async ({ page = 1, limit = 12, role }: { page?: number; limit?: number; role?: string } = {}) => {
    const res = await axiosInstance.get<BasePaginationResponse<IUser>>('/api/users', {
      params: {
        page,
        limit,
        role,
      },
    });
    return res.data;
  },

  getUserById: async ({ id }: { id: string }) => {
    const res = await axiosInstance.get<BaseResponse<IUser>>(`/api/users/${id}`, {});
    return res.data;
  },

  deleteUser: async ({ id }: { id: string }) => {
    const res = await axiosInstance.delete<BaseResponse<IUser>>(`/api/users/${id}`, {});
    return res.data;
  },
};
