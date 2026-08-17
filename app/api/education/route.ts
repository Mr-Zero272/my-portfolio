import { EducationFormSchema } from '@/features/education';
import { educationService } from '@/features/education/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await educationService.getAll(request.headers, searchParams);

  return apiPaginated(result.educations, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = EducationFormSchema.parse(body);
  const result = await educationService.create(request.headers, input);

  return apiCreated(result);
});
