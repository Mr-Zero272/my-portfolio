'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarItem } from '@/types';
import { buildHref } from '@/utils';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavMain({
  baseHref = '',
  sidebarGroupLabel = 'Platform',
  items,
}: {
  baseHref?: string;
  sidebarGroupLabel?: string;
  items: SidebarItem[];
}) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const isSubItemActive = (url: string) => pathname === url;
  const isItemActive = (item: (typeof items)[number]) =>
    item.items?.some((sub) => isSubItemActive(sub.url)) ?? pathname === item.url;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{sidebarGroupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasItems = !!item.items && item.items.length > 0;

          if (!hasItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isItemActive(item)}
                  render={
                    <Link
                      href={buildHref({
                        url: item.url,
                        baseHref,
                        applyBaseHref: item.applyBaseHref,
                      })}
                    />
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          if (state === 'collapsed') {
            return (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton tooltip={item.title} isActive={isItemActive(item)} />
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="min-w-48">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.title}
                          data-active={isSubItemActive(subItem.url)}
                          render={
                            <Link
                              href={buildHref({
                                url: subItem.url,
                                applyBaseHref: subItem.applyBaseHref,
                                baseHref,
                              })}
                            />
                          }
                        >
                          {subItem.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible key={item.title} defaultOpen={item.isActive || isItemActive(item)}>
              <SidebarMenuItem>
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive(item)}
                      className="group/button"
                    />
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-panel-open/button:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          render={
                            <Link
                              href={buildHref({
                                url: subItem.url,
                                applyBaseHref: subItem.applyBaseHref,
                                baseHref,
                              })}
                            />
                          }
                          isActive={isSubItemActive(subItem.url)}
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
