import { createEnumOptionsHelper } from '@/lib/options';
import {
  BriefcaseBusinessIcon,
  Code2Icon,
  GraduationCapIcon,
  LineSquiggleIcon,
  LucideIcon,
} from 'lucide-react';
import React, { SVGProps } from 'react';

export enum ExperiencePositionIconTypeEnum {
  CODE = 'code',
  DESIGN = 'design',
  BUSINESS = 'business',
  EDUCATION = 'education',
}

export const EXPERIENCE_POSITION_ICON_TYPE_CONFIG = {
  [ExperiencePositionIconTypeEnum.CODE]: {
    label: 'Code',
    icon: Code2Icon,
  },
  [ExperiencePositionIconTypeEnum.DESIGN]: {
    label: 'Design',
    icon: LineSquiggleIcon,
  },
  [ExperiencePositionIconTypeEnum.BUSINESS]: {
    label: 'Business',
    icon: BriefcaseBusinessIcon,
  },
  [ExperiencePositionIconTypeEnum.EDUCATION]: {
    label: 'Education',
    icon: GraduationCapIcon,
  },
} as const satisfies Record<
  ExperiencePositionIconTypeEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const experiencePositionIconTypeHelper = createEnumOptionsHelper(
  EXPERIENCE_POSITION_ICON_TYPE_CONFIG,
);

export const EXPERIENCE_POSITION_ICON_TYPE_OPTIONS = experiencePositionIconTypeHelper.options;
export const EXPERIENCE_POSITION_ICON_TYPE_LABEL = experiencePositionIconTypeHelper.labelMap;
export const getExperiencePositionIconTypeLabel = experiencePositionIconTypeHelper.getLabel;
export const getExperiencePositionIconTypeConfig = experiencePositionIconTypeHelper.getConfig;
export const parseToExperiencePositionIconType = experiencePositionIconTypeHelper.parse;
export type ExperiencePositionIconTypeValue = keyof typeof EXPERIENCE_POSITION_ICON_TYPE_CONFIG;
