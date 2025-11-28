import { BriefcaseBusiness, Eye, Laptop, LucideIcon, UserIcon } from 'lucide-react';

export interface SideNavSettingsItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SideNavSettingsGroup {
  title: string;
  items: SideNavSettingsItem[];
}

export const sideNavSettingsItems: SideNavSettingsGroup[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Profile',
        url: '/settings/profile',
        icon: UserIcon,
      },
      {
        title: 'Appearance',
        url: '/settings/appearance',
        icon: Eye,
      },
      {
        title: 'Session',
        url: '/settings/session',
        icon: Laptop,
      },
      {
        title: 'Experience',
        url: '/settings/experience',
        icon: BriefcaseBusiness,
      },
    ],
  },
];
