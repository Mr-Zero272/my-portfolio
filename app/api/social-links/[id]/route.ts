import { SocialLinkFormSchema } from '@/features/social-link';
import { socialLinkService } from '@/features/social-link/server';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type SocialLinkRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(
  async (request: Request, context: SocialLinkRouteContext) => {
    const { id } = await context.params;
    const result = await socialLinkService.getById(request.headers, id);

    return apiOk(result);
  },
);

export const PATCH = withApiErrorHandling(
  async (request: Request, context: SocialLinkRouteContext) => {
    const { id } = await context.params;
    const body = await request.json();
    const input = SocialLinkFormSchema.partial().parse(body);
    const result = await socialLinkService.update(request.headers, id, input);

    return apiOk(result);
  },
);

export const DELETE = withApiErrorHandling(
  async (request: Request, context: SocialLinkRouteContext) => {
    const { id } = await context.params;
    const result = await socialLinkService.delete(request.headers, id);

    return apiOk(result);
  },
);
