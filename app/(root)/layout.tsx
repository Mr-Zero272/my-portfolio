import PageTransition from '@/components/animations/page-transition';
import Navigation from '@/components/layouts/components/navigation/navigation';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layouts/components/header';
import { ThemeProvider } from '@/components/contexts/theme-provider';
import SidebarProvider from '@/components/contexts/sidebar-context';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'My portfolio',
    description: 'This is a website about me',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    <SidebarProvider>
                        <main className="relative flex h-screen w-full">
                            <Navigation />
                            <section className="mt-16 flex w-full flex-col gap-5 md:ml-20">
                                <Header />
                                <PageTransition>{children}</PageTransition>
                            </section>
                        </main>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
