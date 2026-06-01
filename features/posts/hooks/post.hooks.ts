'use client';

import { type CrudId } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostCreateInput, PostUpdateInput } from '../schemas';
import { postKeys, postServices, type PostListParams } from '../services';

export function usePosts(params?: PostListParams) {
  return useQuery({
    queryFn: () => postServices.getAll(params),
    queryKey: postKeys.list(params),
  });
}

export function usePost(id: CrudId) {
  return useQuery({
    queryFn: () => postServices.getById(id),
    queryKey: postKeys.detail(id),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreateInput) => postServices.create(data),
    mutationKey: postKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: PostUpdateInput; id: CrudId }) =>
      postServices.update(id, data),
    mutationKey: postKeys.update(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: CrudId) => postServices.delete(id),
    mutationKey: postKeys.delete(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}
