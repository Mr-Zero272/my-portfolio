import AppLogo from '@/components/shared/logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

type Props = {
  redirectLink?: string;
  title?: string;
  subTitle?: string;
};

export const AppSidebarHeader = ({
  redirectLink = '/',
  title = 'Our Work Space',
  subTitle = "Let's start working",
}: Props) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          render={<Link href={redirectLink} />}
        >
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <AppLogo className="size-8!" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{title}</span>
            <span className="truncate text-xs">{subTitle}</span>
          </div>
          {/* <ChevronsUpDownIcon className="ml-auto" /> */}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
