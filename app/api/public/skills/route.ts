import { skillService } from '@/features/skill/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await skillService.getPublicAll(searchParams);

  return apiPaginated(result.skills, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
