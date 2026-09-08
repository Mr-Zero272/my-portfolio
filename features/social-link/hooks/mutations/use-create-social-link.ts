import { SocialLink } from '@prisma/client';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { CreateSocialLinkRequest } from '../../types';

type UseCreateSocialLinkOptions = Omit<
  UseMutationOptions<SocialLink, Error, CreateSocialLinkRequest>,
  'mutationFn'
>;

export const useCreateSocialLink = (options?: UseCreateSocialLinkOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialLinkApi.create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: socialLinkQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
