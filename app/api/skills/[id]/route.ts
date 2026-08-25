import { SkillFormSchema } from '@/features/skill';
import { skillService } from '@/features/skill/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type SkillRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: SkillRouteContext) => {
  const { id } = await context.params;
  const result = await skillService.getById(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: SkillRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = SkillFormSchema.partial().parse(body);
  const result = await skillService.update(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: SkillRouteContext) => {
  const { id } = await context.params;
  const result = await skillService.delete(request.headers, id);

  return apiOk(result);
});
