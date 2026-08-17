import { EducationFormSchema } from '@/features/education';
import { educationService } from '@/features/education/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type EducationRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: EducationRouteContext) => {
  const { id } = await context.params;
  const result = await educationService.getById(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: EducationRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = EducationFormSchema.partial().parse(body);
  const result = await educationService.update(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: EducationRouteContext) => {
  const { id } = await context.params;
  const result = await educationService.delete(request.headers, id);

  return apiOk(result);
});
