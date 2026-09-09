import {
  BriefcaseBusiness,
  CodeXmlIcon,
  Eye,
  FileCodeIcon,
  Globe,
  GraduationCap,
  Laptop,
  LucideIcon,
  UserCog,
  UserIcon,
} from 'lucide-react';

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
        url: '/app-settings/profile',
        icon: UserIcon,
      },
      {
        title: 'Account',
        url: '/app-settings/account',
        icon: UserCog,
      },
      {
        title: 'Appearance',
        url: '/app-settings/appearance',
        icon: Eye,
      },
      {
        title: 'Session',
        url: '/app-settings/session',
        icon: Laptop,
      },
      {
        title: 'Experiences',
        url: '/app-settings/experiences',
        icon: BriefcaseBusiness,
      },
      {
        title: 'Projects',
        url: '/app-settings/projects',
        icon: FileCodeIcon,
      },
      {
        title: 'Educations',
        url: '/app-settings/educations',
        icon: GraduationCap,
      },
      {
        title: 'Skills',
        url: '/app-settings/skills',
        icon: CodeXmlIcon,
      },
      {
        title: 'Social Links',
        url: '/app-settings/social-links',
        icon: Globe,
      },
    ],
  },
];
