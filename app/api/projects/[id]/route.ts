import { ProjectFormSchema } from '@/features/project';
import { projectService } from '@/features/project/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(async (request: Request, context: ProjectRouteContext) => {
  const { id } = await context.params;
  const result = await projectService.getById(request.headers, id);

  return apiOk(result);
});

export const PATCH = withApiErrorHandling(async (request: Request, context: ProjectRouteContext) => {
  const { id } = await context.params;
  const body = await request.json();
  const input = ProjectFormSchema.partial().parse(body);
  const result = await projectService.update(request.headers, id, input);

  return apiOk(result);
});

export const DELETE = withApiErrorHandling(async (request: Request, context: ProjectRouteContext) => {
  const { id } = await context.params;
  const result = await projectService.delete(request.headers, id);

  return apiOk(result);
});
