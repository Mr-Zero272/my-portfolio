import axiosInstance from '@/lib/axios';
import { Tag } from '@/lib/generated/prisma/client';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  CreateTagRequest,
  DeleteTagRequest,
  GetTagRequest,
  GetTagsBatchRequest,
  GetTagsRequest,
  UpdateTagRequest,
} from '../types';

export const tagApi = {
  getAll: async (request?: GetTagsRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/tags', {
      params: queryParams,
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<Tag>;
  },

  getBatch: async (request?: GetTagsBatchRequest) => {
    const res = await axiosInstance.get('/tags/batch', {
      params: {
        ids: request?.query?.ids,
        limit: request?.query?.limit,
        page: request?.query?.page,
      },
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<Tag>;
  },

  getById: async (request: GetTagRequest) => {
    const res = await axiosInstance.get(`/tags/${request.path?.id}`);

    return res.data.data as Tag;
  },

  create: async (request: CreateTagRequest) => {
    const res = await axiosInstance.post('/tags', request.body);

    return res.data.data as Tag;
  },

  update: async (request: UpdateTagRequest) => {
    const res = await axiosInstance.patch(`/tags/${request.path?.id}`, request.body);

    return res.data.data as Tag;
  },

  delete: async (request: DeleteTagRequest) => {
    const res = await axiosInstance.delete(`/tags/${request.path?.id}`);

    return res.data.data as Tag;
  },
};
