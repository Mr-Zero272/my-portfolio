export interface SidebarItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  applyBaseHref?: boolean;
  items?: {
    title: string;
    url: string;
    applyBaseHref?: boolean;
  }[];
}

export interface SidebarGroup {
  groupSidebarLabel: string;
  items: SidebarItem[];
}
