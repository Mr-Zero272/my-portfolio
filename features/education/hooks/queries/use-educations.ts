import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { educationApi, educationQueryKeys } from '../../services';
import { GetEducationsRequest } from '../../types';

export const useEducations = (request?: GetEducationsRequest) => {
  return useQuery({
    queryKey: educationQueryKeys.list(request),
    queryFn: () => educationApi.getAll(request),
    placeholderData: keepPreviousData,
  });
};
