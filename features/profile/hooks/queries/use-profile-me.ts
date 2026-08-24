import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { profileApi, profileQueryKeys } from '../../services';
import { ProfileWithAllRelations } from '../../types';

type UseProfileMeOptions = Omit<
  UseQueryOptions<
    ProfileWithAllRelations,
    Error,
    ProfileWithAllRelations,
    ReturnType<typeof profileQueryKeys.me | typeof profileQueryKeys.public>
  >,
  'queryKey' | 'queryFn'
> & {
  isPublic?: boolean;
};

export const useProfileMe = (options?: UseProfileMeOptions) => {
  const isPublic = options?.isPublic ?? false;
  return useQuery({
    queryKey: isPublic ? profileQueryKeys.public() : profileQueryKeys.me(),
    queryFn: () => (isPublic ? profileApi.getPublicProfile() : profileApi.getMe()),
    ...options,
  });
};
