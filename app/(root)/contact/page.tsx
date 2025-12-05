import ContactFeature from '@/features/contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
  keywords: [
    'contact Thuong Phan Thanh',
    'hire full stack developer',
    'freelance developer',
    'web development services',
    'Next.js developer for hire',
    'React developer for hire',
    'Angular developer for hire',
    'Java Spring developer',
    'remote developer',
    'Vietnam developer',
    'collaboration',
    'job opportunities',
  ],
  openGraph: {
    title: 'Contact Thuong Phan Thanh - Hire Full Stack Developer',
    description:
      'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
    url: 'https://pitithuong.vercel.app/contact',
    images: [
      {
        url: '/images/projects/portfolio/my-portfolio-h-3.png',
        width: 1200,
        height: 630,
        alt: 'Contact Thuong Phan Thanh',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Thuong Phan Thanh - Hire Full Stack Developer',
    description:
      'Ready to collaborate? Contact me for full stack development projects, freelance work, or job opportunities. Specialized in Next.js, React, Angular, Java Spring.',
    images: ['/images/projects/portfolio/my-portfolio-h-3.png'],
  },
};

const ContactPage = () => {
  return <ContactFeature />;
};

export default ContactPage;
