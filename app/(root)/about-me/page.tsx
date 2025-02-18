import { Metadata } from 'next';
import Resume from './resume';

export const metadata: Metadata = {
    title: 'About me - @pitithuong',
    description: 'Learn more about my background, skills, and experience in web development.',
    keywords: ['about me', 'developer', 'Next.js', 'React', 'portfolio'],
    openGraph: {
        title: 'About Me - @pitithuong',
        description: 'Learn more about my background, skills, and experience in web development.',
        url: 'https://my-portfolio-rust-gamma-52.vercel.app/about',
        images: [
            {
                url: '/images/projects/portfolio/my-portfolio-h-2.png',
                width: 1200,
                height: 630,
                alt: 'About Me',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Me - @pitithuong',
        description: 'Learn more about my background, skills, and experience in web development.',
        images: ['/images/projects/portfolio/my-portfolio-h-2.png'],
    },
};

const AboutMePage = () => {
    return (
        <>
            <Resume />
        </>
    );
};

export default AboutMePage;
