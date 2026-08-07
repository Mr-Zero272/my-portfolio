import { uploadFromUrlSchema } from '@/features/gallery/schemas/gallery.schema';
import { galleryService } from '@/features/gallery/server/gallery.service';
import { apiCreated, withApiErrorHandling } from '@/lib/api';

export const POST = withApiErrorHandling(async (request: Request) => {
  const body = await request.json();
  const input = uploadFromUrlSchema.parse(body);
  const result = await galleryService.uploadFromUrl(request.headers, input);

  return apiCreated(result);
});
