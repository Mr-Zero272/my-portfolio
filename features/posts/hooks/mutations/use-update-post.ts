import { Post } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from 'next/dist/server/api-utils';
import { postApi, postQueryKeys } from '../../services';
import { UpdatePostRequest } from '../../types';

type UseUpdatePostOptions = Omit<
  UseMutationOptions<Post, ApiError, UpdatePostRequest>,
  'mutationFn'
>;

export const useUpdatePost = (options?: UseUpdatePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.update,
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
