import PageTransition from '@/components/animations/page-transition';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex h-screen w-full">
      <section className="flex w-full flex-col gap-5">
        <PageTransition noFooter>{children}</PageTransition>
      </section>
    </main>
  );
}
