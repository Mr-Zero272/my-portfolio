import PageTransition from '@/components/animations/page-transition';
import Navigation from '@/components/layouts/components/navigation/navigation';
import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import SidebarProvider from '@/components/contexts/sidebar-context';
import { ThemeProvider } from '@/components/contexts/theme-provider';
import Header from '@/components/layouts/components/header';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { MusicPlayerProvider } from '@/components/contexts/music-context';

// const geistSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// });

export const metadata: Metadata = {
    title: '@pitithuong',
    description: 'This is a website about pitithuong',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    <MusicPlayerProvider>
                        <SidebarProvider>
                            <main className="relative flex h-screen w-full">
                                <Navigation />
                                <section className="flex w-full flex-col gap-5 md:ml-20">
                                    <Header />
                                    <PageTransition>{children}</PageTransition>
                                </section>
                            </main>
                        </SidebarProvider>
                    </MusicPlayerProvider>
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    );
}
