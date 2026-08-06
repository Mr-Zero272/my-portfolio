import axiosInstance from '@/lib/axios';
import { Post } from '@/lib/generated/prisma/client';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostRequest,
  GetPostsRequest,
  UpdatePostRequest,
} from '../types';

export const postApi = {
  getAll: async (request?: GetPostsRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/posts', {
      params: queryParams,
    });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    };
  },

  getById: async (request: GetPostRequest) => {
    const res = await axiosInstance.get(`/posts/${request.path?.id}`);

    return res.data.data as Post;
  },

  create: async (request: CreatePostRequest) => {
    const res = await axiosInstance.post('/posts', request.body);

    return res.data.data as Post;
  },

  update: async (request: UpdatePostRequest) => {
    const res = await axiosInstance.patch(`/posts/${request.path?.id}`, request.body);

    return res.data.data as Post;
  },

  delete: async (request: DeletePostRequest) => {
    const res = await axiosInstance.delete(`/posts/${request.path?.id}`);

    return res.data.data as Post;
  },
};
