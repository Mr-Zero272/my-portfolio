import { DashboardHeader, DashboardSidebar } from '@/components/layouts/dashboard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className="@container/main container mx-auto flex flex-1 flex-col gap-2">
            <DashboardHeader />
            <div className="px-4 pb-20 md:px-10 md:pb-10">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
