import { Tag } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { tagApi, tagQueryKeys } from '../../services';
import { GetTagRequest } from '../../types';

type UseTagOptions = Omit<
  UseQueryOptions<Tag, Error, Tag, ReturnType<typeof tagQueryKeys.detail>>,
  'queryKey' | 'queryFn'
>;

export const useTag = (request: GetTagRequest, options?: UseTagOptions) => {
  return useQuery({
    queryKey: tagQueryKeys.detail(request),
    queryFn: () => tagApi.getById(request),
    ...options,
  });
};
