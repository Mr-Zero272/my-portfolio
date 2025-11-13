import DashboardHeader from '@/components/layouts/components/dashboard-header';
import { DashboardNav } from '@/components/layouts/components/dashboard-navigation/dashboard-nav';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <DashboardNav variant="inset" />
        <SidebarInset>
          {/* <PageTransition noFooter className="pt-0"> */}
          <DashboardHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main container mx-auto flex flex-1 flex-col gap-2">
              <div className="">{children}</div>
            </div>
          </div>
          {/* </PageTransition> */}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
