import { GalleryImage } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError } from 'next/dist/server/api-utils';
import { galleryApi, galleryQueryKeys } from '../../services';
import { DeleteGalleryImageRequest } from '../../types';

type UseDeleteGalleryOptions = Omit<
  UseMutationOptions<GalleryImage, ApiError, DeleteGalleryImageRequest>,
  'mutationFn'
>;

export const useDeleteGallery = (options?: UseDeleteGalleryOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKeys.lists(), exact: false });
      queryClient.invalidateQueries({
        queryKey: galleryQueryKeys.detail({ path: { id: args[1].path?.id || '' } }),
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
};
