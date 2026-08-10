import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { tagApi, tagQueryKeys } from '../../services';
import { GetTagsBatchRequest } from '../../types';

export const useGetTagsBatch = (request?: GetTagsBatchRequest) => {
  return useQuery({
    queryKey: tagQueryKeys.batch(request),
    queryFn: () => tagApi.getBatch(request),
    placeholderData: keepPreviousData,


  })
}