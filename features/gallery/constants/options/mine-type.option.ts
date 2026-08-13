import { JPGIcon, PNGIcon } from '@/components/icons';
import { createEnumOptionsHelper } from '@/lib/options';
import { ImageIcon, LucideIcon } from 'lucide-react';
import React, { SVGProps } from 'react';

export enum MineTypeEnum {
  WEBP = 'image/webp',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  AVIF = 'image/avif',
}

export const MINE_TYPE_CONFIG = {
  [MineTypeEnum.WEBP]: {
    label: 'WebP',
    icon: ImageIcon,
  },
  [MineTypeEnum.JPEG]: {
    label: 'JPEG',
    icon: JPGIcon,
  },
  [MineTypeEnum.PNG]: {
    label: 'PNG',
    icon: PNGIcon,
  },
  [MineTypeEnum.AVIF]: {
    label: 'AVIF',
    icon: ImageIcon,
  },
} as const satisfies Record<
  MineTypeEnum,
  {
    label: string;
    icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  }
>;

const mineTypeHelper = createEnumOptionsHelper(MINE_TYPE_CONFIG);

export const MINE_TYPE_OPTIONS = mineTypeHelper.options;
export const MINE_TYPE_LABEL = mineTypeHelper.labelMap;
export const getMineTypeLabel = mineTypeHelper.getLabel;
export const getMineTypeConfig = mineTypeHelper.getConfig;
export const parseToMineType = mineTypeHelper.parse;
export type MineTypeValue = keyof typeof MINE_TYPE_CONFIG;
