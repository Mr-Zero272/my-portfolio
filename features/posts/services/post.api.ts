import axiosInstance from '@/lib/axios';
import { Post } from '@/lib/generated/prisma/client';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import {
  CreatePostRequest,
  DeletePostRequest,
  GenerateExcerptRequest,
  GenerateKeywordsRequest,
  GetPostRequest,
  GetPostsRequest,
  PostWithAllRelations,
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
    } as ListResponse<PostWithAllRelations>;
  },

  getById: async (request: GetPostRequest) => {
    const res = await axiosInstance.get(`/posts/${request.path?.id}`);

    return res.data.data as PostWithAllRelations;
  },

  create: async (request: CreatePostRequest) => {
    const res = await axiosInstance.post('/posts', request.body);

    return res.data.data as PostWithAllRelations;
  },

  update: async (request: UpdatePostRequest) => {
    const res = await axiosInstance.patch(`/posts/${request.path?.id}`, request.body);

    return res.data.data as PostWithAllRelations;
  },

  delete: async (request: DeletePostRequest) => {
    const res = await axiosInstance.delete(`/posts/${request.path?.id}`);

    return res.data.data as Post;
  },

  // ai routes
  generateExcerpt: async (request: GenerateExcerptRequest) => {
    const res = await axiosInstance.post('/ai/posts/excerpt', request.body);

    return res.data?.excerpt as string;
  },

  generateKeywords: async (request: GenerateKeywordsRequest) => {
    const res = await axiosInstance.post('/ai/posts/keywords', request.body);

    return res.data?.keywords as string[];
  },
};
