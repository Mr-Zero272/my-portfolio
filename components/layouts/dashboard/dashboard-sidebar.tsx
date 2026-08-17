'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { appPath } from '@/constants/path';
import { SidebarGroup } from '@/types';
import {
  BookOpenIcon,
  ImagesIcon,
  LineSquiggleIcon,
  PenLineIcon,
  Settings2Icon,
  TagIcon,
} from 'lucide-react';
import { AppSidebarHeader } from '../shared';
import { NavMain } from '../shared/nav-main';
import { NavUser } from '../shared/nav-user';

const sidebarGroups: SidebarGroup[] = [
  {
    groupSidebarLabel: 'Quick actions',
    items: [
      {
        title: 'Quick post',
        url: appPath.admin.post.new,
        icon: <LineSquiggleIcon />,
      },
    ],
  },
  {
    groupSidebarLabel: 'Content Management',
    items: [
      {
        title: 'Posts',
        url: appPath.admin.post.list,
        icon: <PenLineIcon />,
      },
      {
        title: 'Tags',
        url: appPath.admin.tag.list,
        icon: <TagIcon />,
      },
      {
        title: 'Galleries',
        url: appPath.admin.gallery.list,
        icon: <ImagesIcon />,
      },
      {
        title: 'Documentation',
        url: '#',
        icon: <BookOpenIcon />,
        items: [
          {
            title: 'Introduction',
            url: '#',
          },
          {
            title: 'Get Started',
            url: '#',
          },
          {
            title: 'Tutorials',
            url: '#',
          },
          {
            title: 'Changelog',
            url: '#',
          },
        ],
      },
      {
        title: 'Settings',
        url: appPath.admin.settings.profile,
        icon: <Settings2Icon />,
      },
    ],
  },
];

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader subTitle="Administrator" redirectLink="/admin" />
      </SidebarHeader>
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <NavMain
            key={group.groupSidebarLabel}
            sidebarGroupLabel={group.groupSidebarLabel}
            items={group.items}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
