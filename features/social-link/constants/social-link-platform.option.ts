import { GithubIcon, LinkedInIcon, XIcon } from '@/components/icons';
import { createEnumOptionsHelper } from '@/lib/options';
import { AnimatedIconProps } from '@/types/animated-icon';
import {
  AtSignIcon,
  GlobeIcon,
  LayersIcon,
  LinkIcon,
  LucideIcon,
  MailIcon,
  PlayIcon,
  Share2Icon,
  ThumbsUpIcon,
} from 'lucide-react';
import React, { SVGProps } from 'react';

export const SOCIAL_LINK_PLATFORM_VALUES = [
  'github',
  'linkedin',
  'x',
  'facebook',
  'instagram',
  'youtube',
  'dribbble',
  'behance',
  'email',
  'website',
  'other',
] as const;

export type SocialLinkPlatform = (typeof SOCIAL_LINK_PLATFORM_VALUES)[number];

export const SOCIAL_LINK_PLATFORM_CONFIG = {
  github: { label: 'GitHub', icon: GithubIcon },
  linkedin: { label: 'LinkedIn', icon: LinkedInIcon },
  x: { label: 'X', icon: XIcon },
  facebook: { label: 'Facebook', icon: ThumbsUpIcon },
  instagram: { label: 'Instagram', icon: AtSignIcon },
  youtube: { label: 'YouTube', icon: PlayIcon },
  dribbble: { label: 'Dribbble', icon: Share2Icon },
  behance: { label: 'Behance', icon: LayersIcon },
  email: { label: 'Email', icon: MailIcon },
  website: { label: 'Website', icon: GlobeIcon },
  other: { label: 'Other', icon: LinkIcon },
} as const satisfies Record<
  SocialLinkPlatform,
  {
    label: string;
    icon:
      | LucideIcon
      | React.ComponentType<SVGProps<SVGSVGElement>>
      | React.ComponentType<AnimatedIconProps>;
  }
>;

const socialLinkPlatformHelper = createEnumOptionsHelper(SOCIAL_LINK_PLATFORM_CONFIG);

export const SOCIAL_LINK_PLATFORM_OPTIONS = socialLinkPlatformHelper.options;
export const SOCIAL_LINK_PLATFORM_LABEL = socialLinkPlatformHelper.labelMap;
export const getSocialLinkPlatformLabel = socialLinkPlatformHelper.getLabel;
export const getSocialLinkPlatformConfig = socialLinkPlatformHelper.getConfig;
export const parseToSocialLinkPlatform = socialLinkPlatformHelper.parse;
export const isSocialLinkPlatform = socialLinkPlatformHelper.isValue;
export type SocialLinkPlatformValue = keyof typeof SOCIAL_LINK_PLATFORM_CONFIG;
