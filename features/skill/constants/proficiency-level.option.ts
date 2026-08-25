import { createEnumOptionsHelper } from '@/lib/options';
import { GaugeIcon, LucideIcon, SproutIcon, TrendingUpIcon, TrophyIcon } from 'lucide-react';
import React, { SVGProps } from 'react';

export enum ProficiencyLevelEnum {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  PROFICIENT = 'Proficient',
  EXPERT = 'Expert',
}

export const PROFICIENCY_LEVEL_CONFIG = {
  [ProficiencyLevelEnum.BEGINNER]: { label: 'Beginner', icon: SproutIcon },
  [ProficiencyLevelEnum.INTERMEDIATE]: { label: 'Intermediate', icon: TrendingUpIcon },
  [ProficiencyLevelEnum.PROFICIENT]: { label: 'Proficient', icon: GaugeIcon },
  [ProficiencyLevelEnum.EXPERT]: { label: 'Expert', icon: TrophyIcon },
} as const satisfies Record<
  ProficiencyLevelEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const proficiencyLevelHelper = createEnumOptionsHelper(PROFICIENCY_LEVEL_CONFIG);

export const PROFICIENCY_LEVEL_OPTIONS = proficiencyLevelHelper.options;
export const PROFICIENCY_LEVEL_LABEL = proficiencyLevelHelper.labelMap;
export const getProficiencyLevelLabel = proficiencyLevelHelper.getLabel;
export const getProficiencyLevelConfig = proficiencyLevelHelper.getConfig;
export const parseToProficiencyLevel = proficiencyLevelHelper.parse;
export type ProficiencyLevelValue = keyof typeof PROFICIENCY_LEVEL_CONFIG;
