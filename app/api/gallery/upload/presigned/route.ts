import { getPresignedUrlSchema } from '@/features/gallery/schemas/gallery.schema';
import { galleryService } from '@/features/gallery/server/gallery.service';
import { apiOk, withApiErrorHandling } from '@/lib/api';

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = getPresignedUrlSchema.parse(body);
  const result = await galleryService.getPresignedUrl(request.headers, input);

  return apiOk(result);
});
