import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  BulkSortSkillsRequest,
  CreateSkillRequest,
  DeleteSkillRequest,
  GetSkillRequest,
  GetSkillsRequest,
  SkillWithAllRelations,
  UpdateSkillRequest,
} from '../types';

export const skillApi = {
  getAll: async (request?: GetSkillsRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/skills', { params: queryParams });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<SkillWithAllRelations>;
  },

  getById: async (request: GetSkillRequest) => {
    const res = await axiosInstance.get(`/skills/${request.path?.id}`);
    return res.data?.data as SkillWithAllRelations;
  },

  create: async (request: CreateSkillRequest) => {
    const res = await axiosInstance.post('/skills', request.body);
    return res.data?.data as SkillWithAllRelations;
  },

  update: async (request: UpdateSkillRequest) => {
    const res = await axiosInstance.patch(`/skills/${request.path?.id}`, request.body);
    return res.data?.data as SkillWithAllRelations;
  },

  delete: async (request: DeleteSkillRequest) => {
    const res = await axiosInstance.delete(`/skills/${request.path?.id}`);
    return res.data?.data as { id: string };
  },

  bulkSort: async (request: BulkSortSkillsRequest) => {
    const res = await axiosInstance.put('/skills/bulk-sort', request.body);
    return res.data?.data as { success: boolean };
  },
};
