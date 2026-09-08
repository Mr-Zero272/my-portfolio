import { SocialLink } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { UpdateSocialLinkRequest } from '../../types';

type UseUpdateSocialLinkOptions = Omit<
  UseMutationOptions<SocialLink, Error, UpdateSocialLinkRequest>,
  'mutationFn'
>;

export const useUpdateSocialLink = (options?: UseUpdateSocialLinkOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialLinkApi.update,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: socialLinkQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
