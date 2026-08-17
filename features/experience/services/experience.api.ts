import axiosInstance from '@/lib/axios';
import { Experience } from '@/lib/generated/prisma/client';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  CreateExperienceRequest,
  DeleteExperienceRequest,
  GetExperienceRequest,
  GetExperiencesRequest,
  UpdateExperienceRequest,
} from '../types';

export const experienceApi = {
  getAll: async (request?: GetExperiencesRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/experience', {
      params: queryParams,
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<Experience>;
  },

  getById: async (request: GetExperienceRequest) => {
    const res = await axiosInstance.get(`/experience/${request.path?.id}`);
    return res.data?.data as Experience;
  },

  create: async (request: CreateExperienceRequest) => {
    const res = await axiosInstance.post('/experience', request.body);
    return res.data?.data as Experience;
  },

  update: async (request: UpdateExperienceRequest) => {
    const res = await axiosInstance.patch(`/experience/${request.path?.id}`, request.body);
    return res.data?.data as Experience;
  },

  delete: async (request: DeleteExperienceRequest) => {
    const res = await axiosInstance.delete(`/experience/${request.path?.id}`);
    return res.data?.data as { id: string };
  },
};
