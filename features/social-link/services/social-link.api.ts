import axiosInstance from '@/lib/axios';
import { ListResponse } from '@/types/api';
import { normalizeQueryParams } from '@/utils/search-query';
import { SocialLink } from '@prisma/client';
import {
  BulkSortSocialLinksRequest,
  CreateSocialLinkRequest,
  DeleteSocialLinkRequest,
  GetSocialLinkRequest,
  GetSocialLinksRequest,
  UpdateSocialLinkRequest,
} from '../types';

export const socialLinkApi = {
  getAll: async (request?: GetSocialLinksRequest) => {
    const queryParams = request?.query ? normalizeQueryParams(request?.query) : undefined;
    const res = await axiosInstance.get('/social-links', { params: queryParams });

    return {
      list: res.data?.data,
      meta: res.data?.meta,
    } as ListResponse<SocialLink>;
  },

  getById: async (request: GetSocialLinkRequest) => {
    const res = await axiosInstance.get(`/social-links/${request.path?.id}`);
    return res.data?.data as SocialLink;
  },

  create: async (request: CreateSocialLinkRequest) => {
    const res = await axiosInstance.post('/social-links', request.body);
    return res.data?.data as SocialLink;
  },

  update: async (request: UpdateSocialLinkRequest) => {
    const res = await axiosInstance.patch(`/social-links/${request.path?.id}`, request.body);
    return res.data?.data as SocialLink;
  },

  delete: async (request: DeleteSocialLinkRequest) => {
    const res = await axiosInstance.delete(`/social-links/${request.path?.id}`);
    return res.data?.data as { id: string };
  },

  bulkSort: async (request: BulkSortSocialLinksRequest) => {
    const res = await axiosInstance.put('/social-links/bulk-sort', request.body);
    return res.data?.data as { success: boolean };
  },
};
