'use client';

import * as React from 'react';

import AppLogo from '@/components/shared/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  CameraIcon,
  CogIcon,
  GalleryHorizontalIcon,
  LayoutGrid,
  SearchIcon,
  SquarePenIcon,
  TagIcon,
} from 'lucide-react';
import Link from 'next/link';
import DashboardNavDocuments from './dashboard-nav-document';
import DashboardNavMain from './dashboard-nav-main';
import DashboardNavSecondary from './dashboard-nav-secondary';
import DashboardNavUser from './dashboard-nav-user';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/piti/dashboard',
      icon: LayoutGrid,
    },
    {
      title: 'Posts',
      url: '/piti/posts',
      icon: SquarePenIcon,
    },
    {
      title: 'Tag',
      url: '/piti/tags',
      icon: TagIcon,
    },
    {
      title: 'Gallery',
      url: '/piti/gallery',
      icon: GalleryHorizontalIcon,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: CameraIcon,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: LayoutGrid,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: LayoutGrid,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: CogIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: LayoutGrid,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: LayoutGrid,
    },
    {
      name: 'Reports',
      url: '#',
      icon: LayoutGrid,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: LayoutGrid,
    },
  ],
};

export function DashboardNav({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/piti/dashboard" className="h-10 w-full">
              <AppLogo withText className="h-8 w-16" />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.navMain} />
        <DashboardNavDocuments items={data.documents} />
        <DashboardNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
