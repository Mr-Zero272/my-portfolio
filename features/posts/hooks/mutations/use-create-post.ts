import { Post } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from 'next/dist/server/api-utils';
import { postApi, postQueryKeys } from '../../services';
import { CreatePostRequest } from '../../types';

type UseCreatePostOptions = Omit<
  UseMutationOptions<Post, ApiError, CreatePostRequest>,
  'mutationFn'
>;

export const useCreatePost = (options?: UseCreatePostOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApi.create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
