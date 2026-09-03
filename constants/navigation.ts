import {
  CogIcon,
  HeadphonesIcon,
  LayoutDashboardIcon,
  NotebookPenIcon,
  SendIcon,
  SquareTerminalIcon,
  TelescopeIcon,
  UserIcon
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
      href: '/blogs',
      label: 'Blogs',
    },
  ],
  secondary: [
    {
      icon: SquareTerminalIcon,
      href: '/changelog',
      label: 'Changelog',
    },
    {
      icon: CogIcon,
      href: '/settings',
      label: 'Settings',
    },
  ],
};
