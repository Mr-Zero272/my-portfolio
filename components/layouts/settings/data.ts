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
        url: '/settings/profile',
        icon: UserIcon,
      },
      {
        title: 'Account',
        url: '/settings/account',
        icon: UserCog,
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
        title: 'Experiences',
        url: '/settings/experiences',
        icon: BriefcaseBusiness,
      },
      {
        title: 'Projects',
        url: '/settings/projects',
        icon: FileCodeIcon,
      },
      {
        title: 'Educations',
        url: '/settings/educations',
        icon: GraduationCap,
      },
      {
        title: 'Skills',
        url: '/settings/skills',
        icon: CodeXmlIcon,
      },
      {
        title: 'Social Links',
        url: '/settings/social-links',
        icon: Globe,
      },
    ],
  },
];
