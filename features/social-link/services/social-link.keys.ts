import { GetSocialLinkRequest, GetSocialLinksRequest } from '../types';

export const socialLinkQueryKeys = {
  all: ['social-link'] as const,
  lists: () => [...socialLinkQueryKeys.all, 'list'] as const,
  list: (request?: GetSocialLinksRequest) => [...socialLinkQueryKeys.all, 'list', request] as const,
  detail: (request: GetSocialLinkRequest) =>
    [...socialLinkQueryKeys.all, 'detail', request.path?.id] as const,
};
