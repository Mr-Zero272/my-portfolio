import axiosInstance from '@/lib/axios';
import type { ApiSuccessResponse } from '@/lib/api';
import type { SiteSettingOnboardingInput, SiteSettingUpdateInput } from '../schemas';
import type { SafeSiteSetting } from '../types/site-setting.types';

export const siteSettingServices = {
  // queries
  get: async () => {
    const response =
      await axiosInstance.get<ApiSuccessResponse<{ setting: SafeSiteSetting | null }>>(
        '/site-setting',
      );

    return response.data.data.setting;
  },

  // mutations
  onboarding: async (data: SiteSettingOnboardingInput) => {
    const response = await axiosInstance.post<ApiSuccessResponse<{ setting: SafeSiteSetting }>>(
      '/site-setting/onboarding',
      data,
    );

    return response.data.data.setting;
  },
  update: async (data: SiteSettingUpdateInput) => {
    const response = await axiosInstance.patch<ApiSuccessResponse<{ setting: SafeSiteSetting }>>(
      '/site-setting',
      data,
    );

    return response.data.data.setting;
  },
};
