import { IPost } from '@/models/Post';
import { BasePaginationResponse, BaseResponse } from '@/types/response';
import axiosInstance from '../lib/axios';

export const postApi = {
  getPosts: async ({
    page = 1,
    limit = 12,
    tag,
    author,
    status,
    approval_status,
    sort_by,
  }: {
    page?: number;
    limit?: number;
    tag?: string;
    author?: string;
    status?: string;
    approval_status?: string;
    sort_by?: string;
  } = {}) => {
    const res = await axiosInstance.get<BasePaginationResponse<IPost>>('/api/posts', {
      params: {
        page,
        limit,
        tag,
        author,
        status,
        approval_status,
        sort_by,
      },
    });
    return res.data;
  },

  createPost: async ({ data }: { data: unknown }) => {
    const res = await axiosInstance.post<BaseResponse<IPost>>('/api/posts', data, {
      params: {
        lang: 'en-US',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getPostByIdOrSlug: async ({ postIdOrSlug }: { postIdOrSlug: string }) => {
    const res = await axiosInstance.get<BaseResponse<IPost>>(`/api/posts/${postIdOrSlug}`);
    return res.data;
  },

  updatePost: async ({ postId, data }: { postId: string; data: unknown }) => {
    const res = await axiosInstance.patch<BaseResponse<IPost>>(`/api/posts/${postId}`, data, {
      params: {
        lang: 'en-US',
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deletePost: async ({ postId }: { postId: string }) => {
    const res = await axiosInstance.delete<BaseResponse<null>>(`/api/posts/${postId}`);
    return res.data;
  },

  // Commented out post history functions as they don't exist in this project
  /*
  getPostHistory: async ({ postId }: { postId: string }) => {
    const res = await axiosInstance.get<BasePaginationResponse<PostHistory>>(`api/post-histories/${postId}`);
    return res.data;
  },

  createPostHistory: async ({ postId }: { postId: string }) => {
    const res = await axiosInstance.post<BaseResponse<PostHistory>>(`/api/post-histories`, {
      post: postId,
    });
    return res.data;
  },

  restorePostFromHistory: async ({ postHistoryId, postId }: { postHistoryId: string; postId: string }) => {
    const res = await axiosInstance.post<BaseResponse<IPost>>(`/api/post-histories/restore`, {
      postHistoryId,
      postId,
    });
    return res.data;
  },
  */
};
