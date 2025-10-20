import PageTransition from '@/components/animations/page-transition';
import Header from '@/components/layouts/components/header';
import Navigation from '@/components/layouts/components/navigation/navigation';
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
      <Navigation />
      <section className="flex w-full flex-col gap-5 overflow-y-auto md:ml-20">
        <Header />
        <PageTransition>{children}</PageTransition>
      </section>
    </main>
  );
}
