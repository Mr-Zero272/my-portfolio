import apiClient from '@/lib/axios';
import type { ISocialLink } from '@/models/SocialLink';

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
  username?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateSocialLinkDto extends Partial<CreateSocialLinkDto> {}

export const socialLinksApi = {
  /**
   * Get all social links
   */
  getAll: async (params?: { userId?: string; owner?: boolean }): Promise<ISocialLink[]> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.owner) queryParams.append('owner', 'true');

    const response = await apiClient.get<ISocialLink[]>(`/api/social-links?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get social link by ID
   */
  getById: async (id: string): Promise<ISocialLink> => {
    const response = await apiClient.get<ISocialLink>(`/api/social-links/${id}`);
    return response.data;
  },

  /**
   * Create a new social link
   */
  create: async (data: CreateSocialLinkDto): Promise<ISocialLink> => {
    const response = await apiClient.post<ISocialLink>('/api/social-links', data);
    return response.data;
  },

  /**
   * Update social link
   */
  update: async (id: string, data: UpdateSocialLinkDto): Promise<ISocialLink> => {
    const response = await apiClient.put<ISocialLink>(`/api/social-links/${id}`, data);
    return response.data;
  },

  /**
   * Delete social link
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/social-links/${id}`);
    return response.data;
  },

  /**
   * Reorder social links
   */
  reorder: async (orderedIds: string[]): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>('/api/social-links', { orderedIds });
    return response.data;
  },
};
