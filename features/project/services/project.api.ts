import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
    CreateProjectRequest,
    DeleteProjectRequest,
    GetProjectRequest,
    GetProjectsRequest,
    ProjectWithAllRelations,
    UpdateProjectRequest,
} from '../types';

export const projectApi = {
  getAll: async (request?: GetProjectsRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/projects', { params: queryParams });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<ProjectWithAllRelations>;
  },

  getById: async (request: GetProjectRequest) => {
    const res = await axiosInstance.get(`/projects/${request.path?.id}`);
    return res.data?.data as ProjectWithAllRelations;
  },

  create: async (request: CreateProjectRequest) => {
    const res = await axiosInstance.post('/projects', request.body);
    return res.data?.data as ProjectWithAllRelations;
  },

  update: async (request: UpdateProjectRequest) => {
    const res = await axiosInstance.patch(`/projects/${request.path?.id}`, request.body);
    return res.data?.data as ProjectWithAllRelations;
  },

  delete: async (request: DeleteProjectRequest) => {
    const res = await axiosInstance.delete(`/projects/${request.path?.id}`);
    return res.data?.data as { id: string };
  },
};
