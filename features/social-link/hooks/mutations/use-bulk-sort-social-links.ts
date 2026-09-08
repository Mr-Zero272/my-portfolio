import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { BulkSortSocialLinksRequest } from '../../types';

type UseBulkSortSocialLinksOptions = Omit<
  UseMutationOptions<{ success: boolean }, Error, BulkSortSocialLinksRequest>,
  'mutationFn'
>;

export const useBulkSortSocialLinks = (options?: UseBulkSortSocialLinksOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: socialLinkApi.bulkSort,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: socialLinkQueryKeys.lists(), exact: false });
      options?.onSuccess?.(...args);
    },
  });
};
