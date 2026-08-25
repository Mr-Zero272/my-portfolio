import { projectService } from '@/features/project/server';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await projectService.getPublicAll(searchParams);

  return apiPaginated(result.projects, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
