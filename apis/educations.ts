import apiClient from '@/lib/axios';
import type { IEducation } from '@/models/Education';

export interface CreateEducationDto {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  location?: string;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateEducationDto extends Partial<CreateEducationDto> {}

export const educationsApi = {
  /**
   * Get all educations
   */
  getAll: async (params?: { userId?: string; owner?: boolean }): Promise<IEducation[]> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.owner) queryParams.append('owner', 'true');

    const response = await apiClient.get<IEducation[]>(`/api/educations?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get education by ID
   */
  getById: async (id: string): Promise<IEducation> => {
    const response = await apiClient.get<IEducation>(`/api/educations/${id}`);
    return response.data;
  },

  /**
   * Create a new education
   */
  create: async (data: CreateEducationDto): Promise<IEducation> => {
    const response = await apiClient.post<IEducation>('/api/educations', data);
    return response.data;
  },

  /**
   * Update education
   */
  update: async (id: string, data: UpdateEducationDto): Promise<IEducation> => {
    const response = await apiClient.put<IEducation>(`/api/educations/${id}`, data);
    return response.data;
  },

  /**
   * Delete education
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/educations/${id}`);
    return response.data;
  },
};
