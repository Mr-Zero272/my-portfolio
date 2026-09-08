import { SocialLink } from '@prisma/client';
import { parseToSocialLinkPlatform } from '../../constants';
import { SocialLinkFormValues } from './schema';

export const toSocialLinkFormValues = (socialLink: SocialLink): SocialLinkFormValues => {
  return {
    platform: parseToSocialLinkPlatform(socialLink.platform, 'github'),
    url: socialLink.url,
    username: socialLink.username,
    isActive: socialLink.isActive,
    displayOrder: socialLink.displayOrder,
  };
};
