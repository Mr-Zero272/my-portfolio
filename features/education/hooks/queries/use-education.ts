import { Education } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { educationApi, educationQueryKeys } from '../../services';
import { GetEducationRequest } from '../../types';

type UseEducationOptions = Omit<
  UseQueryOptions<Education, Error, Education, ReturnType<typeof educationQueryKeys.detail>>,
  'queryKey' | 'queryFn'
>;

export const useEducation = (request: GetEducationRequest, options: UseEducationOptions) => {
  return useQuery({
    queryKey: educationQueryKeys.detail(request),
    queryFn: () => educationApi.getById(request),
    ...options,
  });
};
