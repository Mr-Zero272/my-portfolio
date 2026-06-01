'use client';

import { type CrudId } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TagCreateInput, TagUpdateInput } from '../schemas';
import { tagKeys, tagServices, type TagListParams } from '../services';

export function useTags(params?: TagListParams) {
  return useQuery({
    queryFn: () => tagServices.getAll(params),
    queryKey: tagKeys.list(params),
  });
}

export function useTag(id: CrudId) {
  return useQuery({
    queryFn: () => tagServices.getById(id),
    queryKey: tagKeys.detail(id),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagCreateInput) => tagServices.create(data),
    mutationKey: tagKeys.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: TagUpdateInput; id: CrudId }) =>
      tagServices.update(id, data),
    mutationKey: tagKeys.update(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: CrudId) => tagServices.delete(id),
    mutationKey: tagKeys.delete(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) });
    },
  });
}
