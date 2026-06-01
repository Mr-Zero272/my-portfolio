'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingServices } from '../../services/site-setting.api';
import { siteSettingKeys } from '../../services/site-setting.keys';

export const useCreateOnboardingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: siteSettingServices.onboarding,
    mutationKey: siteSettingKeys.onboarding(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteSettingKeys.all });
    },
  });
};
