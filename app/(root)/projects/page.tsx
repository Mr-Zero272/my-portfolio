import { ListProjectsPublicPage } from '@/features/project';
import { Metadata } from 'next';
import { env } from 'process';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
  keywords: [
    'Phan Thanh Thuong projects',
    'React projects',
    'Next.js projects',
    'Angular projects',
    'Java Spring projects',
    'Full Stack projects',
    'web development portfolio',
    'JavaScript projects',
    'TypeScript projects',
    'open source',
    'GitHub projects',
  ],
  openGraph: {
    title: 'Projects by Phan Thanh Thuong | Front End Developer',
    description:
      'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
    url: 'https://pitithuong.vercel.app/projects',
    images: [
      {
        url: `${env.NEXT_PUBLIC_SITE_URL}/api/og/photo?brand=pitithuong&lable=projects&title=Phan%20Thanh%20Thuong%20Projects&logo=${env.NEXT_PUBLIC_SITE_URL}/logo.svg`,
        width: 1200,
        height: 630,
        alt: 'Projects by Thuong Phan Thanh',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects by Phan Thanh Thuong | Front End Developer',
    description:
      'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
    images: [`${env.NEXT_PUBLIC_SITE_URL}/api/og/photo?brand=pitithuong&lable=projects&title=Phan%20Thanh%20Thuong%20Projects&logo=${env.NEXT_PUBLIC_SITE_URL}/logo.svg`],
  },
};

const ProjectPage = () => {
  return <ListProjectsPublicPage />;
};

export default ProjectPage;
