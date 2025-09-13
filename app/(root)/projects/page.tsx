import ProjectFeature from '@/features/projects';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
  description:
    'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
  keywords: [
    'Thuong Phan Thanh projects',
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
    title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
    description:
      'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
    url: 'https://pitithuong.vercel.app/projects',
    images: [
      {
        url: '/images/projects/portfolio/my-portfolio-h-4.png',
        width: 1200,
        height: 630,
        alt: 'Projects by Thuong Phan Thanh',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects by Thuong Phan Thanh - Full Stack Developer',
    description:
      'Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live demos, source code, and technical implementations.',
    images: ['/images/projects/portfolio/my-portfolio-h-4.png'],
  },
};

const ProjectPage = () => {
  return (
    <section className="p-5">
      <ProjectFeature />
    </section>
  );
};

export default ProjectPage;
