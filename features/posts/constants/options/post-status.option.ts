import { createEnumOptionsHelper } from '@/lib/options';
import { AlarmClockIcon, ArchiveIcon, CircleCheckIcon, ClockIcon, LucideIcon } from 'lucide-react';
import React, { SVGProps } from 'react';

export enum PostStatusEnum {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
  SCHEDULED = 'Scheduled',
  ARCHIVED = 'Archived',
}

export const POST_STATUS_CONFIG = {
  [PostStatusEnum.PUBLISHED]: {
    label: 'Published',
    icon: CircleCheckIcon,
  },
  [PostStatusEnum.DRAFT]: {
    label: 'Draft',
    icon: ClockIcon,
  },
  [PostStatusEnum.SCHEDULED]: {
    
label: 'Scheduled',
    icon: AlarmClockIcon,
  },
  [PostStatusEnum.ARCHIVED]: {
    label: 'Archived',
    icon: ArchiveIcon,
  },
} as const satisfies Record<
  PostStatusEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const PostStatusHelper = createEnumOptionsHelper(POST_STATUS_CONFIG);

export const POST_STATUS_OPTIONS = PostStatusHelper.options;
export const POST_STATUS_LABEL = PostStatusHelper.labelMap;
export const getPostStatusLabel = PostStatusHelper.getLabel;
export const getPostStatusConfig = PostStatusHelper.getConfig;
export const parseToPostStatus = PostStatusHelper.parse;
export type PostStatusValue = keyof typeof POST_STATUS_CONFIG;
