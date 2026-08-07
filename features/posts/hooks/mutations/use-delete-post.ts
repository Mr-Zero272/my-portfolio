import { Post } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from 'next/dist/server/api-utils';
import { postApi, postQueryKeys } from '../../services';
import { DeletePostRequest } from '../../types';

type UseDeletePostOptions = Omit<
  UseMutationOptions<Post, ApiError, DeletePostRequest>,
  'mutationFn'
>;

export const useDeletePost = (options?: UseDeletePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists(), exact: false });
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.detail({ path: { id: args[1]?.path?.id || '' } }),
      });
      options?.onSuccess?.(...args);
    },
  });
};
