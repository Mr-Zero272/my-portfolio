import { Tag } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from 'next/dist/server/api-utils';
import { tagApi, tagQueryKeys } from '../../services';
import { DeleteTagRequest } from '../../types';

type UseDeleteTagOptions = Omit<UseMutationOptions<Tag, ApiError, DeleteTagRequest>, 'mutationFn'>;

export const useDeleteTag = (options?: UseDeleteTagOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.lists(), exact: false });
      queryClient.invalidateQueries({
        queryKey: tagQueryKeys.detail({ path: { id: args[1]?.path?.id || '' } }),
      });
      options?.onSuccess?.(...args);
    },
  });
};
