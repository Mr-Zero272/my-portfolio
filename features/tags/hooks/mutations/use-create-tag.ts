import { Tag } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError } from 'next/dist/server/api-utils';
import { tagApi, tagQueryKeys } from '../../services';
import { CreateTagRequest } from '../../types';

type UseCreateTagOptions = Omit<UseMutationOptions<Tag, ApiError, CreateTagRequest>, 'mutationFn'>;

export const useCreateTag = (options?: UseCreateTagOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagApi.create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
