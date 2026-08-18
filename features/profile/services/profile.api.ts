import axiosInstance from '@/lib/axios';
import { ProfileWithAllRelations, UpdateProfileRequest } from '../types';

export const profileApi = {
  getMe: async () => {
    const res = await axiosInstance.get('/profile');
    return res.data?.data as ProfileWithAllRelations;
  },

  update: async (request: UpdateProfileRequest) => {
    const res = await axiosInstance.patch('/profile', request.body);
    return res.data?.data as ProfileWithAllRelations;
  },
};
