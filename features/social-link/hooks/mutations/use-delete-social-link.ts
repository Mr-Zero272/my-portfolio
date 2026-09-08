import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { DeleteSocialLinkRequest } from '../../types';

type UseDeleteSocialLinkOptions = Omit<
  UseMutationOptions<{ id: string }, Error, DeleteSocialLinkRequest>,
  'mutationFn'
>;

export const useDeleteSocialLink = (options?: UseDeleteSocialLinkOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialLinkApi.delete,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: socialLinkQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
