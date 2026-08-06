import { Post } from '@/lib/generated/prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostRequest } from '../../types';

type UsePostOptions = Omit<
  UseQueryOptions<Post, Error, Post, ReturnType<typeof postQueryKeys.detail>>,
  'queryKey' | 'queryFn'
>;

export const usePost = (request: GetPostRequest, options?: UsePostOptions) => {
  return useQuery({
    queryKey: postQueryKeys.detail(request),
    queryFn: () => postApi.getById(request),
    ...options,
  });
};
