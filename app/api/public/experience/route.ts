import { experienceService } from '@/features/experience/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await experienceService.getPublicAll(searchParams);

  return apiPaginated(result.experiences, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
