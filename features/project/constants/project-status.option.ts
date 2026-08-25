import { createEnumOptionsHelper } from '@/lib/options';
import {
    ArchiveIcon,
    CircleCheckIcon,
    ClipboardListIcon,
    HammerIcon,
    LucideIcon,
    RocketIcon,
    WrenchIcon,
} from 'lucide-react';
import React, { SVGProps } from 'react';

export enum ProjectStatusEnum {
  PLANNING = 'planning',
  DEVELOPING = 'developing',
  COMPLETED = 'completed',
  DEPLOYED = 'deployed',
  MAINTENANCE = 'maintenance',
  ARCHIVED = 'archived',
}

export const PROJECT_STATUS_CONFIG = {
  [ProjectStatusEnum.PLANNING]: { label: 'Planning', icon: ClipboardListIcon },
  [ProjectStatusEnum.DEVELOPING]: { label: 'Developing', icon: HammerIcon },
  [ProjectStatusEnum.COMPLETED]: { label: 'Completed', icon: CircleCheckIcon },
  [ProjectStatusEnum.DEPLOYED]: { label: 'Deployed', icon: RocketIcon },
  [ProjectStatusEnum.MAINTENANCE]: { label: 'Maintenance', icon: WrenchIcon },
  [ProjectStatusEnum.ARCHIVED]: { label: 'Archived', icon: ArchiveIcon },
} as const satisfies Record<
  ProjectStatusEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const projectStatusHelper = createEnumOptionsHelper(PROJECT_STATUS_CONFIG);

export const PROJECT_STATUS_OPTIONS = projectStatusHelper.options;
export const PROJECT_STATUS_LABEL = projectStatusHelper.labelMap;
export const getProjectStatusLabel = projectStatusHelper.getLabel;
export const getProjectStatusConfig = projectStatusHelper.getConfig;
export const parseToProjectStatus = projectStatusHelper.parse;
export type ProjectStatusValue = keyof typeof PROJECT_STATUS_CONFIG;
