import { SITE_URL } from '@/configs/env';
import AboutMeFeature from '@/features/about-me';
import { IEducation, IExperience, IProfile, ISkill, IUser } from '@/models';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
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
    const response = await fetch(`${SITE_URL}/api/experiences?owner=true`, {
      next: {
        revalidate: 60 * 60 * 1,
      },
    });
    const experiences = (await response.json()) as IExperience[];
    return experiences;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
};

const fetchEducations = async () => {
  try {
    const response = await fetch(`${SITE_URL}/api/educations?owner=true`, {
      next: {
        revalidate: 60 * 60 * 1,
      },
    });
    const educations = (await response.json()) as IEducation[];
    return educations;
  } catch (error) {
    console.error('Error fetching educations:', error);
    return [];
  }
};

const fetchSkills = async () => {
  try {
    const response = await fetch(`${SITE_URL}/api/skills?owner=true`, {
      next: {
        revalidate: 60 * 60 * 1,
      },
    });
    const skills = (await response.json()) as ISkill[];
    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};

const fetchProfile = async () => {
  try {
    const response = await fetch(`${SITE_URL}/api/profile?owner=true`, {
      next: {
        revalidate: 60 * 60 * 1,
      },
    });
    const profileRes = await response.json();
    return profileRes as { profile: Omit<IProfile, 'userId'> & { userId: IUser }; socialLinks: unknown[] };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

const AboutMePage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['experiences', 'list', { owner: true }], queryFn: fetchExperiences }),
    queryClient.prefetchQuery({ queryKey: ['educations', 'list', { owner: true }], queryFn: fetchEducations }),
    queryClient.prefetchQuery({ queryKey: ['skills', 'list', { owner: true }], queryFn: fetchSkills }),
    queryClient.prefetchQuery({ queryKey: ['profile', 'detail', { owner: true }], queryFn: fetchProfile }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AboutMeFeature />
    </HydrationBoundary>
  );
};

export default AboutMePage;
