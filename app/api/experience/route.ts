import { ExperienceFormSchema } from '@/features/experience';
import { experienceService } from '@/features/experience/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await experienceService.getAll(request.headers, searchParams);

  return apiPaginated(result.experiences, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = ExperienceFormSchema.parse(body);
  const result = await experienceService.create(request.headers, input);

  return apiCreated(result);
});
