import axiosInstance from '@/lib/axios';
import { IComment } from '@/models';
import { ICommentResponse } from '@/models/Comment';
import { BasePaginationResponse, BaseResponse } from '@/types/response';

export const commentsApi = {
  // create or reply a comment
  crateComment: async ({ data }: { data: unknown }) => {
    const res = await axiosInstance.post<BaseResponse<IComment>>('/api/comments', data, {});
    return res.data;
  },

  updateComment: async ({ commentId, data }: { commentId: string; data: unknown }) => {
    const res = await axiosInstance.put<BaseResponse<IComment>>(`/api/comments/${commentId}`, data, {});
    return res.data;
  },

  getCommentsByPostId: async ({ postId }: { postId: string; page?: number; limit?: number }) => {
    const res = await axiosInstance.get<BasePaginationResponse<ICommentResponse>>(`/api/comments`, {
      params: { postId },
    });
    return res.data;
  },

  getCommentByParentId: async ({ parentId }: { parentId: string; page?: number; limit?: number }) => {
    const res = await axiosInstance.get<BasePaginationResponse<ICommentResponse>>(`/api/comments/${parentId}/replies`);
    return res.data;
  },

  deleteComment: async ({ commentId, userId }: { commentId: string; userId: string }) => {
    const res = await axiosInstance.delete<BaseResponse<null>>(`/api/comments/${commentId}`, {
      data: { userId },
    });
    return res.data;
  },
};
