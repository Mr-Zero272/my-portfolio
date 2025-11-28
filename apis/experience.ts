import { CreateExperienceData, UpdateExperienceData } from '@/services/experience-service';
import axios from 'axios';

const baseUrl = '/api/experiences';

export const experienceApi = {
  // Get all experiences (can filter by owner=true)
  getAll: async (params?: { userId?: string; owner?: boolean }) => {
    const { data } = await axios.get(baseUrl, { params });
    return data;
  },

  // Get single experience
  getById: async (id: string) => {
    const { data } = await axios.get(`${baseUrl}/${id}`);
    return data;
  },

  // Create experience
  create: async (data: CreateExperienceData) => {
    const { data: response } = await axios.post(baseUrl, data);
    return response;
  },

  // Update experience
  update: async (id: string, data: UpdateExperienceData) => {
    const { data: response } = await axios.patch(`${baseUrl}/${id}`, data);
    return response;
  },

  // Delete experience
  delete: async (id: string) => {
    const { data } = await axios.delete(`${baseUrl}/${id}`);
    return data;
  },

  // Reorder experiences
  reorder: async (orderedIds: string[]) => {
    const { data } = await axios.patch(baseUrl, { orderedIds });
    return data;
  },
};
