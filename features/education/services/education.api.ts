import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import { Education } from '@prisma/client';
import {
    CreateEducationRequest,
    DeleteEducationRequest,
    GetEducationRequest,
    GetEducationsRequest,
    UpdateEducationRequest,
} from '../types';

export const educationApi = {
  getAll: async (request?: GetEducationsRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/public/education', {
      params: queryParams,
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<Education>;
  },

  getById: async (request: GetEducationRequest) => {
    const res = await axiosInstance.get(`/education/${request.path?.id}`);
    return res.data?.data as Education;
  },

  create: async (request: CreateEducationRequest) => {
    const res = await axiosInstance.post('/education', request.body);
    return res.data?.data as Education;
  },

  update: async (request: UpdateEducationRequest) => {
    const res = await axiosInstance.patch(`/education/${request.path?.id}`, request.body);
    return res.data?.data as Education;
  },

  delete: async (request: DeleteEducationRequest) => {
    const res = await axiosInstance.delete(`/education/${request.path?.id}`);
    return res.data?.data as { id: string };
  },
};
