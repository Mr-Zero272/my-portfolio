import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import PageTransition from '@/components/animations/page-transition';
import Sidebar from '@/components/layouts/components/sidebar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {/* <Header /> */}
                <main className="flex">
                    <Sidebar />
                    <section className="mb-16 w-[calc(100%_-_16rem)] flex-1 max-lg:w-[calc(100%_-_5rem)] max-md:w-full md:mb-0">
                        <PageTransition>{children}</PageTransition>
                    </section>
                </main>
            </body>
        </html>
    );
}