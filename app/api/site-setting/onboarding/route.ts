import { siteSettingOnboardingSchema } from '@/features/site-settings/schemas/site-setting.schema';
import { completeOnboarding } from '@/features/site-settings/server/site-setting.service';
import { apiCreated, withApiErrorHandling } from '@/lib/api';

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = siteSettingOnboardingSchema.parse(body);
  const result = await completeOnboarding(request.headers, input);

  return apiCreated(result);
});
