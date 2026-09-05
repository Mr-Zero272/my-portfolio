import { SlideUpText } from '@/components/animations/slide-up-text';
import { TypingText } from '@/components/animations/typing-text';
import { DiscordIcon, LinkedInIcon } from '@/components/icons';
import GithubIcon from '@/components/icons/github';
import { DownloadButton } from '@/components/shared/dowload-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { profileApi, profileQueryKeys, type ProfileWithAllRelations } from '@/features/profile';
import { getBrowserQueryClient } from '@/lib/query-client';
import { ArrowRightIcon, BriefcaseBusinessIcon, DownloadIcon, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

export default async function Home() {
  const queryClient = await getBrowserQueryClient();

  let profile: ProfileWithAllRelations | null = null;
  try {
    profile = await queryClient.query({
      queryKey: profileQueryKeys.public(),
      queryFn: () => profileApi.getPublicProfile(),
      staleTime: 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    });
  } catch {
    profile = null;
  }

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
              <Button size="lg">
                <ArrowRightIcon /> Hire me
              </Button>
              {display.cvUrl ? (
                <DownloadButton
                  size="lg"
                  variant="outline"
                  idleIcon={<DownloadIcon />}
                  buttonLabel="Download CV"
                  loadingText="Downloading..."
                  successText="Success"
                  url={display.cvUrl}
                />
              ) : // <Button
                //   size="lg"
                //   variant="outline"
                //   nativeButton={false}
                //   render={<a href={display.cvUrl} target="_blank" rel="noreferrer" />}
                // >
                //   <DownloadIcon /> Download CV
                // </Button>
                null}
            </div>
            <Separator className="max-w-2xl" />
            {/* Stats Row */}
            <div className="flex flex-wrap gap-4">
              <span className="text-sm font-medium">Follow me:</span>
              <div className="flex items-center gap-4">
                <Link href="#">
                  <GithubIcon className="h-4 w-4" />
                </Link>
                <Link href="#">
                  <DiscordIcon className="h-4 w-4" />
                </Link>
                <Link href="#">
                  <LinkedInIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
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
