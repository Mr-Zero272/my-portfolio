import { env } from '@/config/env';
import { AboutMePage } from '@/features/about-me';
import type { ExperienceWithAllRelations } from '@/features/experience/types';
import type { ProfileWithAllRelations } from '@/features/profile/types';
import type { SkillWithAllRelations } from '@/features/skill/types';
import { publicGet } from '@/lib/server-fetch';
import type { Education } from '@prisma/client';
import type { Metadata } from 'next';

const SITE_URL = env.SITE_URL ?? 'https://pitithuong.vercel.app';

export const metadata: Metadata = {
  title: 'About Me | Thuong Phan Thanh',
  description:
    'Learn about my journey as a Full Stack Developer working with Next.js, React, Angular, Java Spring. Skills, education and professional background.',
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
  alternates: {
    canonical: `${SITE_URL}/about-me`,
  },
  openGraph: {
    title: 'About Thuong Phan Thanh - Full Stack Developer',
    description:
      'Learn about my journey as a Full Stack Developer working with Next.js, React, Angular, Java Spring. Skills, education and professional background.',
    url: `${SITE_URL}/about-me`,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/projects/portfolio/my-portfolio-h-2.png`,
        width: 1200,
        height: 630,
        alt: 'About Thuong Phan Thanh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Thuong Phan Thanh - Full Stack Developer',
    description:
      'Learn about my journey as a Full Stack Developer working with Next.js, React, Angular, Java Spring. Skills, education and professional background.',
    images: [`${SITE_URL}/images/projects/portfolio/my-portfolio-h-2.png`],
  },
};

export default async function Page() {
  // Server-fetched via the public API and ISR-cached for 1 hour.
  const [profile, educations, skills, experiences] = await Promise.all([
    publicGet<ProfileWithAllRelations>('profile'),
    publicGet<Education[]>('education'),
    publicGet<SkillWithAllRelations[]>('skills'),
    publicGet<ExperienceWithAllRelations[]>('experience'),
  ]);

  return (
    <AboutMePage
      profile={profile}
      educations={educations ?? []}
      skills={skills ?? []}
      experiences={experiences ?? []}
    />
  );
}
