import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { postApi, postQueryKeys } from '../../services';
import { GetPostRequest, PostWithAllRelations } from '../../types';

type UsePostOptions = Omit<
  UseQueryOptions<
    PostWithAllRelations,
    Error,
    PostWithAllRelations,
    ReturnType<typeof postQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const usePost = (request: GetPostRequest, options?: UsePostOptions) => {
  return useQuery({
    queryKey: postQueryKeys.detail(request),
    queryFn: () => postApi.getById(request),
    ...options,
  });
};
