import { galleryService } from '@/features/gallery/server/gallery.service';
import { apiOk, withApiErrorHandling } from '@/lib/api';

type GalleryRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiErrorHandling(
  async (request: Request, context: GalleryRouteContext) => {
    const { id } = await context.params;
    const result = await galleryService.getById(request.headers, id);

    return apiOk(result);
  }
);

export const DELETE = withApiErrorHandling(
  async (request: Request, context: GalleryRouteContext) => {
    const { id } = await context.params;
    const result = await galleryService.delete(request.headers, id);

    return apiOk(result);
  }
);
