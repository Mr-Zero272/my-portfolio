import { ProfileFormSchema } from '@/features/profile';
import { profileService } from '@/features/profile/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const result = await profileService.getMe(request.headers);
  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = ProfileFormSchema.partial().parse(body);
  const result = await profileService.upsert(request.headers, input);

  return apiOk(result);
});
