'use client';

import { type CrudId } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostTagCreateInput, PostTagUpdateInput } from '../schemas';
import { postTagKeys, postTagServices, type PostTagListParams } from '../services';

export function usePostTags(params?: PostTagListParams) {
  return useQuery({
    queryFn: () => postTagServices.getAll(params),
    queryKey: postTagKeys.list(params),
  });
}

export function usePostTag(id: CrudId) {
  return useQuery({
    queryFn: () => postTagServices.getById(id),
    queryKey: postTagKeys.detail(id),
  });
}

export function useCreatePostTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostTagCreateInput) => postTagServices.create(data),
    mutationKey: postTagKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postTagKeys.all });
    },
  });
}

export function useUpdatePostTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: PostTagUpdateInput; id: CrudId }) =>
      postTagServices.update(id, data),
    mutationKey: postTagKeys.update(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postTagKeys.all });
      queryClient.invalidateQueries({ queryKey: postTagKeys.detail(id) });
    },
  });
}

export function useDeletePostTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: CrudId) => postTagServices.delete(id),
    mutationKey: postTagKeys.delete(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postTagKeys.all });
      queryClient.invalidateQueries({ queryKey: postTagKeys.detail(id) });
    },
  });
}
