import AppBreadcrumbs from '@/components/shared/app-breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const DashboardHeader = () => {
  return (
    <header className="bg-background sticky top-0 flex h-12 shrink-0 items-center gap-2 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <AppBreadcrumbs />
      </div>
    </header>
  );
};
