import DashboardHeader from '@/components/layouts/components/dashboard-header';
import { DashboardNav } from '@/components/layouts/components/dashboard-navigation/dashboard-nav';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import NextTopLoader from 'nextjs-toploader';

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
        <NextTopLoader
          color="#ff6900"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <DashboardNav variant="inset" />
        <SidebarInset>
          {/* <PageTransition noFooter className="pt-0"> */}
          <div>
            <DashboardHeader />
            {children}
          </div>
          {/* </PageTransition> */}
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
