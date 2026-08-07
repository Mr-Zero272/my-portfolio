import { GetGalleryImageRequest, GetGalleryImagesRequest } from '../types';

export const galleryQueryKeys = {
  all: ['gallery'],
  lists: () => [...galleryQueryKeys.all, 'list'],
  list: (request?: GetGalleryImagesRequest) => [...galleryQueryKeys.lists(), request],
  detail: (request: GetGalleryImageRequest) => [
    ...galleryQueryKeys.all,
    'detail',
    request.path?.id,
  ],
};
