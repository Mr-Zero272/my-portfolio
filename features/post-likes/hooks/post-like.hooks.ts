'use client';

import { type CrudId } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostLikeCreateInput, PostLikeUpdateInput } from '../schemas';
import { postLikeKeys, postLikeServices, type PostLikeListParams } from '../services';

export function usePostLikes(params?: PostLikeListParams) {
  return useQuery({
    queryFn: () => postLikeServices.getAll(params),
    queryKey: postLikeKeys.list(params),
  });
}

export function usePostLike(id: CrudId) {
  return useQuery({
    queryFn: () => postLikeServices.getById(id),
    queryKey: postLikeKeys.detail(id),
  });
}

export function useCreatePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostLikeCreateInput) => postLikeServices.create(data),
    mutationKey: postLikeKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postLikeKeys.all });
    },
  });
}

export function useUpdatePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: PostLikeUpdateInput; id: CrudId }) =>
      postLikeServices.update(id, data),
    mutationKey: postLikeKeys.update(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postLikeKeys.all });
      queryClient.invalidateQueries({ queryKey: postLikeKeys.detail(id) });
    },
  });
}

export function useDeletePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: CrudId) => postLikeServices.delete(id),
    mutationKey: postLikeKeys.delete(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postLikeKeys.all });
      queryClient.invalidateQueries({ queryKey: postLikeKeys.detail(id) });
    },
  });
}
