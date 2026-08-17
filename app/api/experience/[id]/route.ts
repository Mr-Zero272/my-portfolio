import { ExperienceFormSchema } from '@/features/experience';
import { experienceService } from '@/features/experience/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type ExperienceRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: ExperienceRouteContext) => {
  const { id } = await context.params;
  const result = await experienceService.getById(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: ExperienceRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = ExperienceFormSchema.partial().parse(body);
  const result = await experienceService.update(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: ExperienceRouteContext) => {
  const { id } = await context.params;
  const result = await experienceService.delete(request.headers, id);

  return apiOk(result);
});
