import { createEnumOptionsHelper } from '@/lib/options';
import {
    Code2Icon,
    ContainerIcon,
    DatabaseIcon,
    LayoutGridIcon,
    LucideIcon,
    ServerIcon,
    SparklesIcon,
    WrenchIcon,
} from 'lucide-react';
import React, { SVGProps } from 'react';

export enum SkillCategoryEnum {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  DATABASE = 'Database',
  DEVOPS = 'DevOps',
  TOOLS = 'Tools',
  LANGUAGE = 'Language',
  OTHER = 'Other',
}

export const SKILL_CATEGORY_CONFIG = {
  [SkillCategoryEnum.FRONTEND]: { label: 'Frontend', icon: LayoutGridIcon },
  [SkillCategoryEnum.BACKEND]: { label: 'Backend', icon: ServerIcon },
  [SkillCategoryEnum.DATABASE]: { label: 'Database', icon: DatabaseIcon },
  [SkillCategoryEnum.DEVOPS]: { label: 'DevOps', icon: ContainerIcon },
  [SkillCategoryEnum.TOOLS]: { label: 'Tools', icon: WrenchIcon },
  [SkillCategoryEnum.LANGUAGE]: { label: 'Language', icon: Code2Icon },
  [SkillCategoryEnum.OTHER]: { label: 'Other', icon: SparklesIcon },
} as const satisfies Record<
  SkillCategoryEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const skillCategoryHelper = createEnumOptionsHelper(SKILL_CATEGORY_CONFIG);

export const SKILL_CATEGORY_OPTIONS = skillCategoryHelper.options;
export const SKILL_CATEGORY_LABEL = skillCategoryHelper.labelMap;
export const getSkillCategoryLabel = skillCategoryHelper.getLabel;
export const getSkillCategoryConfig = skillCategoryHelper.getConfig;
export const parseToSkillCategory = skillCategoryHelper.parse;
export type SkillCategoryValue = keyof typeof SKILL_CATEGORY_CONFIG;
