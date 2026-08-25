import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  CreateExperienceRequest,
  DeleteExperienceRequest,
  ExperienceWithAllRelations,
  GetExperienceRequest,
  GetExperiencesRequest,
  UpdateExperienceRequest,
} from '../types';

export const experienceApi = {
  getAll: async (request?: GetExperiencesRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/public/experience', {
      params: queryParams,
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<ExperienceWithAllRelations>;
  },

  getById: async (request: GetExperienceRequest) => {
    const res = await axiosInstance.get(`/experience/${request.path?.id}`);
    return res.data?.data as ExperienceWithAllRelations;
  },

  create: async (request: CreateExperienceRequest) => {
    const res = await axiosInstance.post('/experience', request.body);
    return res.data?.data as ExperienceWithAllRelations;
  },

  update: async (request: UpdateExperienceRequest) => {
    const res = await axiosInstance.patch(`/experience/${request.path?.id}`, request.body);
    return res.data?.data as ExperienceWithAllRelations;
  },

  delete: async (request: DeleteExperienceRequest) => {
    const res = await axiosInstance.delete(`/experience/${request.path?.id}`);
    return res.data?.data as { id: string };
  },
};
