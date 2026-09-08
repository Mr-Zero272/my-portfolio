import { SocialLink } from '@prisma/client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { socialLinkApi, socialLinkQueryKeys } from '../../services';
import { GetSocialLinkRequest } from '../../types';

type UseSocialLinkOptions = Omit<
  UseQueryOptions<
    SocialLink,
    Error,
    SocialLink,
    ReturnType<typeof socialLinkQueryKeys.detail>
  >,
  'queryKey' | 'queryFn'
>;

export const useSocialLink = (request: GetSocialLinkRequest, options?: UseSocialLinkOptions) => {
  return useQuery({
    queryKey: socialLinkQueryKeys.detail(request),
    queryFn: () => socialLinkApi.getById(request),
    ...options,
  });
};
