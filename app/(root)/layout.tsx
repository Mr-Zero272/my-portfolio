import PageTransition from '@/components/animations/page-transition';
import Navigation from '@/components/layouts/components/navigation/navigation';
import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import { MusicPlayerProvider } from '@/components/contexts/music-context';
import SidebarProvider from '@/components/contexts/sidebar-context';
import { ThemeProvider } from '@/components/contexts/theme-provider';
import Header from '@/components/layouts/components/header';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';

// const geistSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// });

// JSON-LD Structured Data
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Thuong Phan Thanh',
    jobTitle: 'Full Stack Developer',
    description:
        'Full Stack Developer specialized in Next.js, React, Angular, Java Spring. 6+ months experience building modern web applications.',
    url: 'https://pitithuong.vercel.app/',
    image: 'https://pitithuong.vercel.app/images/profile-img-no-bg.png',
    sameAs: ['https://github.com/pitithuong', 'https://linkedin.com/in/pitithuong', 'https://youtube.com/@pitithuong'],
    worksFor: {
        '@type': 'Organization',
        name: 'Freelance',
    },
    knowsAbout: [
        'Next.js',
        'React',
        'Angular',
        'Java',
        'Spring Framework',
        'JavaScript',
        'TypeScript',
        'Web Development',
        'Full Stack Development',
        'Frontend Development',
        'Backend Development',
    ],
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Your University/School Name', // Update this with actual education
    },
};

export const metadata: Metadata = {
    metadataBase: new URL('https://pitithuong.vercel.app'),
    title: {
        default: 'Thuong Phan Thanh - Full Stack Developer Portfolio',
        template: '%s | Thuong Phan Thanh',
    },
    description:
        'Full Stack Developer specialized in Next.js, React, Angular, Java Spring. 6+ months experience building modern web applications. Available for hire.',
    keywords: [
        'Thuong Phan Thanh',
        'Full Stack Developer',
        'Next.js Developer',
        'React Developer',
        'Angular Developer',
        'Java Spring Developer',
        'Portfolio',
        'Web Development',
        'Frontend Developer',
        'Backend Developer',
        'JavaScript',
        'TypeScript',
        'Vietnam Developer',
        'Hire Developer',
    ],
    authors: [{ name: 'Pitithuong', url: 'https://pitithuong.vercel.app/' }],
    openGraph: {
        title: 'Thuong Phan Thanh - Full Stack Developer Portfolio',
        description:
            'Full Stack Developer specialized in Next.js, React, Angular, Java Spring. 6+ months experience building modern web applications. Available for hire.',
        url: 'https://pitithuong.vercel.app/',
        siteName: 'Thuong Phan Thanh Portfolio',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-1.png',
                width: 1200,
                height: 630,
                alt: 'Thuong Phan Thanh - Full Stack Developer Portfolio',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Thuong Phan Thanh - Full Stack Developer Portfolio',
        description:
            'Full Stack Developer specialized in Next.js, React, Angular, Java Spring. 6+ months experience building modern web applications. Available for hire.',
        images: ['/images/projects/portfolio/my-portfolio-h-1.png'],
        creator: '@pitithuong',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://pitithuong.vercel.app/', // Set canonical URL to prevent duplicate content issues
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </head>
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
