import PageTransition from '@/components/animations/page-transition';
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
          <PageTransition noFooter>{children}</PageTransition>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
