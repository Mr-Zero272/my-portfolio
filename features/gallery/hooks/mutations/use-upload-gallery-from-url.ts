import { GalleryImage } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from 'next/dist/server/api-utils';
import { galleryApi, galleryQueryKeys } from '../../services';
import { UploadGalleryImageFromUrlInputRequest } from '../../types';

type UseUploadGalleryFromUrlOptions = Omit<
  UseMutationOptions<GalleryImage, ApiError, UploadGalleryImageFromUrlInputRequest>,
  'mutationFn'
>;

export const useUploadGalleryFormUrl = (options?: UseUploadGalleryFromUrlOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.uploadByUrl,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: galleryQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
