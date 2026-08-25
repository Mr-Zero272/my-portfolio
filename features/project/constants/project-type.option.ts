import { createEnumOptionsHelper } from '@/lib/options';
import {
    GlobeIcon,
    LibraryIcon,
    LucideIcon,
    MonitorIcon,
    SmartphoneIcon,
    SparklesIcon,
    WebhookIcon,
} from 'lucide-react';
import React, { SVGProps } from 'react';

export enum ProjectTypeEnum {
  WEBSITE = 'website',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api',
  LIBRARY = 'library',
  OTHER = 'other',
}

export const PROJECT_TYPE_CONFIG = {
  [ProjectTypeEnum.WEBSITE]: { label: 'Website', icon: GlobeIcon },
  [ProjectTypeEnum.MOBILE]: { label: 'Mobile', icon: SmartphoneIcon },
  [ProjectTypeEnum.DESKTOP]: { label: 'Desktop', icon: MonitorIcon },
  [ProjectTypeEnum.API]: { label: 'API', icon: WebhookIcon },
  [ProjectTypeEnum.LIBRARY]: { label: 'Library', icon: LibraryIcon },
  [ProjectTypeEnum.OTHER]: { label: 'Other', icon: SparklesIcon },
} as const satisfies Record<
  ProjectTypeEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const projectTypeHelper = createEnumOptionsHelper(PROJECT_TYPE_CONFIG);

export const PROJECT_TYPE_OPTIONS = projectTypeHelper.options;
export const PROJECT_TYPE_LABEL = projectTypeHelper.labelMap;
export const getProjectTypeLabel = projectTypeHelper.getLabel;
export const getProjectTypeConfig = projectTypeHelper.getConfig;
export const parseToProjectType = projectTypeHelper.parse;
export type ProjectTypeValue = keyof typeof PROJECT_TYPE_CONFIG;
