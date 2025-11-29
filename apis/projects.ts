import apiClient from '@/lib/axios';
import type { IProject } from '@/models';

export interface CreateProjectDto {
  name: string;
  slug: string;
  description: string;
  responsibilities?: string;
  type?: string;
  status?: string;
  images?: string[];
  thumbnailImage?: string;
  demoUrl?: string;
  sourceCodeUrl?: string;
  technologies?: string[];
  databases?: string[];
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  isFeatured?: boolean;
  displayOrder?: number;
  isVisible?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export const projectsApi = {
  /**
   * Get all projects
   */
  getAll: async (params?: { userId?: string; owner?: boolean }): Promise<IProject[]> => {
    const queryParams = new URLSearchParams();
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.owner) queryParams.append('owner', 'true');

    const response = await apiClient.get<IProject[]>(`/api/projects?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get project by ID
   */
  getById: async (id: string): Promise<IProject> => {
    const response = await apiClient.get<IProject>(`/api/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  create: async (data: CreateProjectDto): Promise<IProject> => {
    const response = await apiClient.post<IProject>('/api/projects', data);
    return response.data;
  },

  /**
   * Update project
   */
  update: async (id: string, data: UpdateProjectDto): Promise<IProject> => {
    const response = await apiClient.put<IProject>(`/api/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete project
   */
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/projects/${id}`);
    return response.data;
  },
};
