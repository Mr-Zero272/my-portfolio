import { SITE_URL } from '@/configs/env';
import AboutMeFeature from '@/features/about-me';
import { IExperience } from '@/models';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Thuong Phan Thanh - Full Stack Developer',
  description:
    'Learn about my journey as a Full Stack Developer. 6+ months experience with Next.js, React, Angular, Java Spring. Skills, education, and professional background.',
  keywords: [
    'Thuong Phan Thanh',
    'about me',
    'Full Stack Developer',
    'developer background',
    'Next.js',
    'React',
    'Angular',
    'Java Spring',
    'portfolio',
    'skills',
    'experience',
  ],
  openGraph: {
    title: 'About Thuong Phan Thanh - Full Stack Developer',
    description:
      'Learn about my journey as a Full Stack Developer. 1 year experience with Next.js, React, Angular, Java Spring. Skills, education, and professional background.',
    url: 'https://pitithuong.vercel.app/about-me',
    images: [
      {
        url: '/images/projects/portfolio/my-portfolio-h-2.png',
        width: 1200,
        height: 630,
        alt: 'About Thuong Phan Thanh',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Thuong Phan Thanh - Full Stack Developer',
    description:
      'Learn about my journey as a Full Stack Developer. 1 year experience with Next.js, React, Angular, Java Spring. Skills, education, and professional background.',
    images: ['/images/projects/portfolio/my-portfolio-h-2.png'],
  },
};

const fetchExperiences = async () => {
  try {
    const response = await fetch(`${SITE_URL}/api/experiences?owner=true`);
    const experiences = (await response.json()) as IExperience[];
    return experiences;
  } catch (error) {
    throw error;
  }
};

const AboutMePage = async () => {
  try {
    const experiences = await fetchExperiences();
    return <AboutMeFeature experiences={experiences} />;
  } catch (error) {
    throw error;
  }
};

export default AboutMePage;
