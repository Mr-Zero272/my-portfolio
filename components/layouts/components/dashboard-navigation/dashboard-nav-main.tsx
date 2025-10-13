'use client';

import { AnimatedButton } from '@/components/ui/animated-button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Globe, LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/posts/create" className="flex-1">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-300 ease-in-out active:scale-90"
              >
                <Plus />
                <span>Quick Create Post</span>
              </SidebarMenuButton>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/blog">
                  <AnimatedButton
                    size="icon"
                    className="size-8 cursor-pointer group-data-[collapsible=icon]:opacity-0"
                    variant="outline"
                  >
                    <Globe />
                  </AnimatedButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-center">View Website</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = (pathname.includes(item.url) && item.url.length > 1) || pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={cn('', {
                    'text-primary hover:text-primary': isActive,
                  })}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
