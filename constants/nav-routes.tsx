import {
  Blog,
  BlogSolid,
  Contact,
  ContactSolid,
  Home,
  HomeSolid,
  Music,
  MusicSolid,
  Projects,
  ProjectsSolid,
  User,
  UserSolid,
} from '@/components/icons';
import { Cog, MessageCircleQuestion } from 'lucide-react';

export const navbarRoutesInfo = [
  {
    icon: Home,
    iconSolid: HomeSolid,
    route: '/',
    label: 'Home',
  },
  {
    icon: User,
    iconSolid: UserSolid,
    route: '/about-me',
    label: 'About me',
  },
  {
    icon: Projects,
    iconSolid: ProjectsSolid,
    route: '/projects',
    label: 'Projects',
  },
  {
    icon: Contact,
    iconSolid: ContactSolid,
    route: '/contact',
    label: 'Contact',
  },
  {
    icon: Music,
    iconSolid: MusicSolid,
    route: '/favorite',
    label: 'My favorite',
  },
  {
    icon: Blog,
    iconSolid: BlogSolid,
    route: '/blog',
    label: 'Blog',
  },
];

export const navbarSecondaryRoutesInfo = [
  {
    icon: MessageCircleQuestion,
    iconSolid: MessageCircleQuestion,
    route: '/help-supports',
    label: 'Help & Supports',
  },
  {
    icon: Cog,
    iconSolid: Cog,
    route: '/settings',
    label: 'Settings',
  },
];
