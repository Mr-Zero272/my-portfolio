import { PageTransition } from '@/components/animations/page-transition';
import { BottomNavBar } from '@/components/layouts/root/bottom-nav-bar';
import { RootSidebar } from '@/components/layouts/root/sidebar';
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
    <main className="relative flex w-full">
      <RootSidebarProvider>
        <RootSidebar />
        {/* <CursorSetting /> */}
        <section className="relative flex w-full flex-col gap-5 overflow-y-auto md:ml-20">
          {/* <Header /> */}
          <PageTransition>{children}</PageTransition>
        </section>
        <BottomNavBar />
      </RootSidebarProvider>
    </main>
  );
}
