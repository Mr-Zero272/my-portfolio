import { educationService } from '@/features/education/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await educationService.getPublicAll(searchParams);

  return apiPaginated(result.educations, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
