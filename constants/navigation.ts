import {
  CogIcon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  NotebookPenIcon,
  SendIcon,
  TelescopeIcon,
  UserIcon,
} from 'lucide-react';

export const rootNavigation = {
  main: [
    {
      icon: LayoutDashboardIcon,
      href: '/',
      label: 'Home',
    },
    {
      icon: UserIcon,
      href: '/about-me',
      label: 'About me',
    },
    {
      icon: TelescopeIcon,
      href: '/projects',
      label: 'Projects',
    },
    {
      icon: SendIcon,
      href: '/contact',
      label: 'Contact',
    },
    {
      icon: HeadphonesIcon,
      href: '/favorite',
      label: 'My favorite',
    },
    {
      icon: NotebookPenIcon,
      href: '/blog',
      label: 'Blog',
    },
  ],
  secondary: [
    {
      icon: MessageCircleQuestionIcon,
      href: '/help-supports',
      label: 'Help & Supports',
    },
    {
      icon: CogIcon,
      href: '/settings',
      label: 'Settings',
    },
  ],
};
