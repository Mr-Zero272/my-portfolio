import { SkillFormSchema } from '@/features/skill';
import { skillService } from '@/features/skill/server';
import { apiCreated, apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await skillService.getAll(request.headers, searchParams);

  return apiPaginated(result.skills, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = SkillFormSchema.parse(body);
  const result = await skillService.create(request.headers, input);

  return apiCreated(result);
});
