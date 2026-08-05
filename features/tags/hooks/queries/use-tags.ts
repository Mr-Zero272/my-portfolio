import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tagApi, tagQueryKeys } from '../../services';
import { GetTagsRequest } from '../../types';

export const useTags = (request?: GetTagsRequest) => {
  return useQuery({
    queryKey: tagQueryKeys.list(request),
    queryFn: () => tagApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
