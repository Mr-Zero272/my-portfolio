import { Profile } from '@/lib/generated/prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { profileApi, profileQueryKeys } from '../../services';

type UseProfileMeOptions = Omit<
  UseQueryOptions<Profile, Error, Profile, ReturnType<typeof profileQueryKeys.me>>,
  'queryKey' | 'queryFn'
>;

export const useProfileMe = (options?: UseProfileMeOptions) => {
  return useQuery({
    queryKey: profileQueryKeys.me(),
    queryFn: () => profileApi.getMe(),
    ...options,
  });
};
