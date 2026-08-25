import { SocialLinkFormSchema } from '@/features/social-link';
import { socialLinkService } from '@/features/social-link/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await socialLinkService.getAll(request.headers, searchParams);

  return apiPaginated(result.socialLinks, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = SocialLinkFormSchema.parse(body);
  const result = await socialLinkService.create(request.headers, input);

  return apiCreated(result);
});
