import { Profile } from '@/lib/generated/prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError } from 'next/dist/server/api-utils';
import { profileApi, profileQueryKeys } from '../../services';
import { UpdateProfileRequest } from '../../types';

type UseUpdateProfileOptions = Omit<
  UseMutationOptions<Profile, ApiError, UpdateProfileRequest>,
  'mutationFn'
>;

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: profileQueryKeys.me(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
