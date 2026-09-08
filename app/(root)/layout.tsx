import { PageTransition } from '@/components/animations/page-transition';
import { BottomNavBar } from '@/components/layouts/root/bottom-nav-bar';
import { RootHeader } from '@/components/layouts/root/root-header';
import { RootSidebar } from '@/components/layouts/root/root-sidebar';
import { RootSidebarProvider } from '@/contexts/root-sidebar.context';
import { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex w-full flex-1">
      <RootSidebarProvider>
        <RootSidebar />
        {/* <CursorSetting /> */}
        <section className="relative flex w-full flex-1 flex-col gap-5 md:ml-20">
          <RootHeader />
          <PageTransition hasFooter>{children}</PageTransition>
        </section>
        <BottomNavBar />
      </RootSidebarProvider>
    </main>
  );
}
