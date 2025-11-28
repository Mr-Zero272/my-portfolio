import AnimatedDownloadButton from '@/components/animations/animated-download-button';
import AnimatedWords from '@/components/animations/animated-words';
import { RotateWords } from '@/components/animations/rotate-words';
import InfoCard from '@/components/cards/info-card';
import { Github, Linkedin, Youtube } from '@/components/icons';
import DigitalClock from '@/components/shared/digital-clock';
import { Button } from '@/components/ui/button';
import { SITE_URL } from '@/configs/env';
import { Clock, Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const fetchGithubStats = async () => {
  try {
    const res = await fetch(`${SITE_URL}/api/github/stats`, {
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch GitHub stats');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return {
      username: process.env.GITHUB_USERNAME || 'github-username',
      avatar: '',
      bio: 'github bio',
      followers: 0,
      following: 0,
      publicRepos: 0,
      totalStars: 0,
      totalForks: 0,
      topLanguages: ['JavaScript', 'TypeScript', 'Python'],
      contributionsThisYear: 0,
    };
  }
};

const fetchProfileInfo = async () => {
  try {
    const res = await fetch(`${SITE_URL}/api/profile?owner=true`, {
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch profile info');
    }
    const jsonParsedData = await res.json();
    return jsonParsedData?.profile;
  } catch (error) {
    console.error('Error fetching profile info:', error);
    throw error;
  }
};

export default async function Home() {
  try {
    const githubStats = await fetchGithubStats();
    const profileInfo = await fetchProfileInfo();

    return (
      <section className="flex flex-col xl:flex-row">
        <div className="relative mb-7 flex flex-1 justify-evenly xl:mb-0 xl:w-5/12 xl:justify-center">
          <Image
            className="size-80 min-[500px]:size-96 xl:h-[40rem] xl:w-full"
            src="/images/profile-img-no-bg.png"
            width={500}
            height={500}
            quality={100}
            alt="profile image no bg"
          />
          <div className="xl:dark:bg-card/50 z-[1] mb-5 hidden flex-col items-center justify-between gap-5 rounded-3xl p-5 sm:flex xl:absolute xl:bottom-0 xl:h-56 xl:w-[26rem] xl:flex-row xl:gap-0 xl:bg-slate-200/30 xl:backdrop-blur-sm">
            <InfoCard title="YOE" content="1.5" sub="Years of experiences" arrow={false} />
            <InfoCard title="Repo" content={githubStats.publicRepos} sub="Public repositories" arrow={false} />
          </div>
        </div>
        <div className="flex-1 p-5">
          <div className="mb-8 flex justify-center p-2 sm:justify-around sm:p-0">
            <div className="relative mt-0 h-80 w-[22rem] sm:w-[30rem]">
              <div className="dark:bg-card h-64 w-full rounded-t-[4rem] rounded-br-[4rem] bg-slate-200/30 py-6 pr-5 pl-8 backdrop-blur-sm">
                <RotateWords text="developer" words={profileInfo.rotatingWords} position="behind" />
                <AnimatedWords text="Hello I'm " className="text-left text-xl sm:text-3xl" />
                <AnimatedWords text={profileInfo.name} className="text-primary text-left text-2xl sm:text-4xl" />
                <p className="text-sm sm:text-base">{profileInfo.description}</p>
              </div>
              <div className="dark:bg-card absolute right-0 bottom-0 z-0 h-[4rem] w-[19rem] bg-slate-200/30 sm:w-[26rem]"></div>
              <div className="flex h-16 w-full items-end justify-between">
                <div className="dark:bg-card flex h-[4rem] w-[3rem] items-center justify-center rounded-b-[4rem] bg-slate-200/30 sm:h-16 sm:w-16"></div>
                <div className="bg-background z-[1] flex h-16 w-[19rem] items-center gap-x-5 rounded-tl-[2rem] p-4 sm:w-[26rem]">
                  <AnimatedDownloadButton variant="outline" className="rounded-full" urlDownload="/api/download/cv" />
                  <Link href="/contact" className="hidden items-center gap-x-2 sm:flex">
                    <Button className="rounded-full active:scale-90">
                      <Handshake className="size-6" />
                      <p className="sm:hidden">Hire me</p>
                    </Button>
                    <p className="hidden cursor-pointer font-bold hover:underline sm:inline-block">Hire me!</p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden flex-col items-center justify-end gap-y-5 sm:flex">
              <div className="border-primary text-primary hover:bg-accent cursor-pointer rounded-full border p-2.5 hover:border-black hover:text-black">
                <Github className="size-6" />
              </div>
              <div className="border-primary text-primary hover:bg-accent cursor-pointer rounded-full border p-2.5 hover:border-red-500 hover:text-red-500">
                <Youtube className="size-6" />
              </div>
              <div className="border-primary text-primary hover:bg-accent cursor-pointer rounded-full border p-2.5 hover:border-blue-700 hover:text-blue-700">
                <Linkedin className="size-6" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5 min-[1440px]:justify-between">
            <div className="dark:bg-card flex h-56 flex-1 items-center justify-around rounded-[3rem] bg-slate-200/30 px-4 py-5 min-[1440px]:flex-1 sm:w-10/12 sm:flex-shrink-0 sm:flex-grow-0 sm:px-7">
              <InfoCard title="Github" content={githubStats.contributionsThisYear} sub="Contributions This Year" />
              <InfoCard className="sm:hidden" title="Repo" content="17" sub="Public repositories" />
              <div className="hidden sm:flex">
                <div className="flex w-60 flex-col">
                  <div className="bg-background flex h-16 w-full items-center justify-center rounded-l-full p-4">
                    <DigitalClock />
                  </div>
                  <div className="relative flex">
                    <div className="bg-background h-20 w-48"></div>
                    <div className="dark:bg-card absolute top-0 left-0 z-[1] h-20 w-48 rounded-tr-2xl bg-slate-200/30">
                      <div className="bg-background m-3 flex items-center gap-x-2 rounded-2xl p-3">
                        <span className="text-4xl text-red-400">{githubStats.totalStars}</span>
                        <p className="text-xs">Total stars earned</p>
                      </div>
                    </div>
                    <div className="bg-background h-20 w-12 rounded-b-full"></div>
                  </div>
                </div>
                <div className="w-20">
                  <div className="bg-background h-20 w-full rounded-r-full p-4">
                    <div className="flex w-fit items-center rounded-full bg-black p-3">
                      <Clock className="size-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-x-2 rounded-full bg-black min-[1440px]:flex dark:bg-white">
              <p className="ms-2 font-semibold text-white dark:text-black">@{profileInfo?.userId?.username}</p>
              <Image
                className="m-0.5 size-10 rounded-full"
                src={profileInfo?.userId?.avatar}
                width={44}
                height={44}
                alt="profile image"
              />
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.log(error);
    throw error; // it will be catched by the error boundary
  }
}
