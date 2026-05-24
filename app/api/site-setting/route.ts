import { siteSettingUpdateSchema } from '@/features/site-settings/schemas/site-setting.schema';
import {
  getSafeSiteSetting,
  updateSiteSetting,
} from '@/features/site-settings/server/site-setting.service';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const result = await getSafeSiteSetting(request.headers);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = siteSettingUpdateSchema.parse(body);
  const result = await updateSiteSetting(request.headers, input);

  return apiOk(result);
});
