import PageTransition from '@/components/animations/page-transition';
import SidebarProvider from '@/components/contexts/sidebar-context';
import Header from '@/components/layouts/components/header';
import Navigation from '@/components/layouts/components/navigation/navigation';
import { MusicStoreInitializer } from '@/components/providers/music-store-initializer';
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
      <MusicStoreInitializer>
        <SidebarProvider>
          <Navigation />
          <section className="flex w-full flex-col gap-5 overflow-y-auto md:ml-20">
            <Header />
            <PageTransition>{children}</PageTransition>
          </section>
        </SidebarProvider>
      </MusicStoreInitializer>
    </main>
  );
}
