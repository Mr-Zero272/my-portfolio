import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { profileApi, profileQueryKeys } from '../../services';
import { ProfileWithAllRelations } from '../../types';

type UseProfileMeOptions = Omit<
  UseQueryOptions<ProfileWithAllRelations, Error, ProfileWithAllRelations, ReturnType<typeof profileQueryKeys.me>>,
  'queryKey' | 'queryFn'
>;

export const useProfileMe = (options?: UseProfileMeOptions) => {
  return useQuery({
    queryKey: profileQueryKeys.me(),
    queryFn: () => profileApi.getMe(),
    ...options,
  });
};
