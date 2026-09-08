import { ListResponse } from '@/types/api';
import { SocialLink } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { GetSocialLinksRequest } from '../../types';

type UseSocialLinksOptions = Omit<
  UseQueryOptions<
    ListResponse<SocialLink>,
    Error,
    ListResponse<SocialLink>,
    ReturnType<typeof socialLinkQueryKeys.list>
  >,
  'queryKey' | 'queryFn'
>;

export const useSocialLinks = (request?: GetSocialLinksRequest, options?: UseSocialLinksOptions) => {
  return useQuery({
    queryKey: socialLinkQueryKeys.list(request),
    queryFn: () => socialLinkApi.getAll(request),
    ...options,
  });
};
