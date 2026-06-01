'use client';

import { type CrudId } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PostAuthorCreateInput, PostAuthorUpdateInput } from '../schemas';
import { postAuthorKeys, postAuthorServices, type PostAuthorListParams } from '../services';

export function usePostAuthors(params?: PostAuthorListParams) {
  return useQuery({
    queryFn: () => postAuthorServices.getAll(params),
    queryKey: postAuthorKeys.list(params),
  });
}

export function usePostAuthor(id: CrudId) {
  return useQuery({
    queryFn: () => postAuthorServices.getById(id),
    queryKey: postAuthorKeys.detail(id),
  });
}

export function useCreatePostAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostAuthorCreateInput) => postAuthorServices.create(data),
    mutationKey: postAuthorKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postAuthorKeys.all });
    },
  });
}

export function useUpdatePostAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: PostAuthorUpdateInput; id: CrudId }) =>
      postAuthorServices.update(id, data),
    mutationKey: postAuthorKeys.update(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postAuthorKeys.all });
      queryClient.invalidateQueries({ queryKey: postAuthorKeys.detail(id) });
    },
  });
}

export function useDeletePostAuthor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: CrudId) => postAuthorServices.delete(id),
    mutationKey: postAuthorKeys.delete(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: postAuthorKeys.all });
      queryClient.invalidateQueries({ queryKey: postAuthorKeys.detail(id) });
    },
  });
}
