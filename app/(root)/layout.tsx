import PageTransition from '@/components/animations/page-transition';
import Header from '@/components/layouts/components/header';
import Navigation from '@/components/layouts/components/navigation/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex h-screen w-full">
      <Navigation />
      <section className="flex w-full flex-col gap-5 overflow-y-auto md:ml-20">
        <Header />
        <PageTransition>{children}</PageTransition>
      </section>
    </main>
  );
}
