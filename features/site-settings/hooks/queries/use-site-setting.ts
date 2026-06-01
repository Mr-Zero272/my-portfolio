'use client';

import { useQuery } from '@tanstack/react-query';
import { siteSettingKeys, siteSettingServices } from '../../services';

export function useSiteSetting() {
  return useQuery({
    queryFn: siteSettingServices.get,
    queryKey: siteSettingKeys.detail(),
  });
}
