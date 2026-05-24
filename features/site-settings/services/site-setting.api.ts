import axiosInstance from '@/lib/axios';
import { SiteSettingOnboardingInput } from '../schemas';

export const siteSettingServices = {
  // queries
  // (none for now)

  // mutations
  onboarding: async (data: SiteSettingOnboardingInput) => {
    const response = axiosInstance.post('/site-setting/onboarding', data);
    return response;
  },
};
