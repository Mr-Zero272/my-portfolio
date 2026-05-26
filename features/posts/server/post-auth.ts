import { requireSiteSettingUser } from '@/features/site-settings/server/site-setting.service';

export async function requirePostManager(headers: Headers) {
  return requireSiteSettingUser(headers);
}
