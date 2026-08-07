import { galleryService } from '@/features/gallery/server/gallery.service';
import { apiPaginated, withApiErrorHandling } from '@/lib/api';

export const GET = withApiErrorHandling(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const result = await galleryService.getAll(request.headers, searchParams);

  return apiPaginated(result.galleryImages, {
    limit: result.pagination.limit,
    page: result.pagination.page,
    total: result.total,
  });
});
