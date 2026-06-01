'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SiteSettingUpdateInput } from '../../schemas';
import { siteSettingKeys, siteSettingServices } from '../../services';

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteSettingUpdateInput) => siteSettingServices.update(data),
    mutationKey: siteSettingKeys.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteSettingKeys.all });
    },
  });
}
