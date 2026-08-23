import { profileService } from '@/features/profile/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async () => {
  const result = await profileService.getPublicProfile();

  return apiOk(result);
});
