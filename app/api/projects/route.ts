import { ProjectFormSchema } from '@/features/project';
import { projectService } from '@/features/project/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await projectService.getAll(request.headers, searchParams);

  return apiPaginated(result.projects, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = ProjectFormSchema.parse(body);
  const result = await projectService.create(request.headers, input);

  return apiCreated(result);
});
