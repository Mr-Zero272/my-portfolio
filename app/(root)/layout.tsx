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
    title: 'Software Development Portfolio - @pitithuong',
    description: 'Explore my projects, programming skills, and experience in web development.',
    keywords: [
        'portfolio',
        'developer',
        'Next.js',
        'React',
        'web development',
        'frontend',
        'frontend developer',
        'backend developer',
    ],
    authors: [{ name: 'Pitithuong', url: 'https://my-portfolio-rust-gamma-52.vercel.app/' }],
    openGraph: {
        title: 'Software Development Portfolio - @pitithuong',
        description: 'Explore my projects, programming skills, and experience in web development.',
        url: 'https://my-portfolio-rust-gamma-52.vercel.app/',
        siteName: 'Pitithuong Portfolio',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-1.png',
                width: 1200,
                height: 630,
                alt: 'Pitithuong Portfolio',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Software Development Portfolio - @pitithuong',
        description: 'Explore my projects, programming skills, and experience in web development.',
        images: ['/images/projects/portfolio/my-portfolio-h-1.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://my-portfolio-rust-gamma-52.vercel.app/', // Set canonical URL to prevent duplicate content issues
    },
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
