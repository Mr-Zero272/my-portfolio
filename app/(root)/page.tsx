import { SlideUpText } from '@/components/animations/slide-up-text';
import { TypingText } from '@/components/animations/typing-text';
import { DownloadButton } from '@/components/shared/dowload-button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { env } from '@/config/env';
import type { ProfileWithAllRelations } from '@/features/profile';
import { getSocialLinkPlatformConfig } from '@/features/social-link';
import { publicGet } from '@/lib/server-fetch';
import { SocialLink } from '@prisma/client';
import { ArrowRightIcon, BriefcaseBusinessIcon, DownloadIcon, MapPinIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const SITE_URL = env.SITE_URL ?? 'https://pitithuong.vercel.app';

const FALLBACK_ROTATING_WORDS = [
  'Web Developer',
  'Full Stack Developer',
  'Next.js Developer',
  'React Developer',
];

const FALLBACK_PROFILE = {
  name: 'Your Name',
  rotatingWords: FALLBACK_ROTATING_WORDS,
  bio: 'Tell your story here — update it from the dashboard.',
  freelanceAvailable: false,
  location: 'Your location',
  heroImageUrl: '/images/profile-new.png',
} as const;

export const metadata: Metadata = {
  title: 'Thuong Phan Thanh — Full Stack Developer',
  description:
    "Hi, I'm Thuong Phan Thanh. I'm a Full Stack Developer working with Next.js, React and modern web technologies. Explore my projects, blogs and experience.",
  keywords: [
    'Thuong Phan Thanh',
    'Full Stack Developer',
    'Next.js',
    'React',
    'Web Developer',
    'portfolio',
    'frontend developer',
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: 'Thuong Phan Thanh — Full Stack Developer',
    description:
      "Hi, I'm Thuong Phan Thanh. I'm a Full Stack Developer working with Next.js, React and modern web technologies.",
    url: `${SITE_URL}/`,
    siteName: 'Thuong Phan Thanh Portfolio',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/projects/portfolio/my-portfolio-h-1.png`,
        width: 1200,
        height: 630,
        alt: 'Thuong Phan Thanh - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thuong Phan Thanh — Full Stack Developer',
    description:
      "Hi, I'm Thuong Phan Thanh. I'm a Full Stack Developer working with Next.js, React and modern web technologies.",
    images: [`${SITE_URL}/images/projects/portfolio/my-portfolio-h-1.png`],
  },
};

export default async function Home() {
  // Server-fetched via the public API and ISR-cached for 1 hour.
  const [profile, socialLinks] = await Promise.all([
    publicGet<ProfileWithAllRelations>('profile'),
    publicGet<SocialLink[]>('social-links'),
  ]);

  const display = {
    name: profile?.name ?? FALLBACK_PROFILE.name,
    rotatingWords:
      profile && profile.rotatingWords.length > 0
        ? profile.rotatingWords
        : FALLBACK_PROFILE.rotatingWords,
    bio: profile?.description ?? profile?.bio ?? FALLBACK_PROFILE.bio,
    freelanceAvailable: profile?.freelanceAvailable ?? FALLBACK_PROFILE.freelanceAvailable,
    location: profile?.address ?? profile?.nationality ?? FALLBACK_PROFILE.location,
    cvUrl: profile?.cvUrl ?? profile?.resumePath ?? undefined,
    heroImageUrl: profile?.heroImage?.url ?? FALLBACK_PROFILE.heroImageUrl,
  };

  return (
    <section className="container mx-auto flex w-full pt-10 pb-10 sm:pt-8">
      <div className="px-4 sm:px-8 lg:px-12">
        {/* Asymmetric 8/4 Split */}
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Content Side */}
          <div className="space-y-6 lg:col-span-8">
            {display.freelanceAvailable ? (
              <Badge variant="secondary" className="ipx-4 py-4 text-base">
                <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                Available for freelance work
              </Badge>
            ) : null}
            <SlideUpText
              split="words"
              className="text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl"
              delay={1.5}
            >
              {`Hi, I'm ${display.name}`}
            </SlideUpText>
            <TypingText
              text={display.rotatingWords}
              speed={150}
              waitTime={3000}
              className="text-2xl font-medium text-slate-700 dark:text-neutral-400"
            />
            <SlideUpText
              split="words"
              delay={1.5}
              className="mt-8 max-w-2xl text-xl text-slate-600 dark:text-neutral-400"
            >
              {display.bio}
            </SlideUpText>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-400">
                <MapPinIcon className="h-4 w-4 text-black" /> {display.location}
              </div>
              {display.freelanceAvailable ? (
                <div className="flex items-center gap-2 text-slate-600 dark:text-neutral-400">
                  <BriefcaseBusinessIcon className="h-4 w-4 text-black" /> Available now
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact?source=hire-me" className={buttonVariants({ size: 'lg' })}>
                <ArrowRightIcon /> Hire me
              </Link>
              {display.cvUrl ? (
                <DownloadButton
                  size="lg"
                  variant="outline"
                  idleIcon={<DownloadIcon />}
                  buttonLabel="Download CV"
                  loadingText="Downloading..."
                  successText="Success"
                  url={display.cvUrl}
                  fileName="phan_thanh_thuong_cv.pdf"
                />
              ) : null}
            </div>
            <Separator className="max-w-2xl" />
            {/* Stats Row */}
            {socialLinks && socialLinks?.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium">Follow me:</span>
                <div className="flex items-center gap-4">
                  {socialLinks?.map((sl) => {
                    const config = getSocialLinkPlatformConfig(sl.platform);
                    if (!config) return null;
                    return (
                      <Link
                        key={sl.id}
                        href={sl.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={buttonVariants({ size: 'icon', variant: 'ghost' })}
                      >
                        <config.icon />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* Image Side */}
          <div className="lg:col-span-4">
            <div data-motion="image" className="relative aspect-3/4 overflow-hidden rounded-3xl">
              <Image
                data-motion="image"
                src={display.heroImageUrl}
                alt="Portrait"
                className="h-full w-full object-cover"
                style={{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }}
                width={800}
                height={800}
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
