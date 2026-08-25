import { socialLinkService } from '@/features/social-link/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await socialLinkService.getPublicAll(searchParams);

  return apiPaginated(result.socialLinks, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
