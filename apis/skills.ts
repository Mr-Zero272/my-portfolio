import apiClient from '@/lib/axios';
import type { ISkill } from '@/models/Skill';

export interface CreateSkillDto {
  name: string;
  proficiency: string;
  category: string;
  icon?: string;
  iconColor?: string;
  description?: string;
  yearsOfExperience?: number;
  displayOrder?: number;
  isVisible?: boolean;
}

export interface UpdateSkillDto extends Partial<CreateSkillDto> {}

export const skillsApi = {
  /**
   * Get all skills
   */
  getAll: async (params?: { userId?: string; owner?: boolean }): Promise<ISkill[]> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.owner) queryParams.append('owner', 'true');

    const response = await apiClient.get<ISkill[]>(`/api/skills?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get skill by ID
   */
  getById: async (id: string): Promise<ISkill> => {
    const response = await apiClient.get<ISkill>(`/api/skills/${id}`);
    return response.data;
  },

  /**
   * Create a new skill
   */
  create: async (data: CreateSkillDto): Promise<ISkill> => {
    const response = await apiClient.post<ISkill>('/api/skills', data);
    return response.data;
  },

  /**
   * Update skill
   */
  update: async (id: string, data: UpdateSkillDto): Promise<ISkill> => {
    const response = await apiClient.put<ISkill>(`/api/skills/${id}`, data);
    return response.data;
  },

  /**
   * Delete skill
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/skills/${id}`);
    return response.data;
  },
};
