import AnimatedDownloadButton from '@/components/animations/animated-download-button';
import AnimatedWords from '@/components/animations/animated-words';
import { RotateWords } from '@/components/animations/rotate-words';
import InfoCard from '@/components/cards/info-card';
import DigitalClock from '@/components/shared/digital-clock';
import { Button } from '@/components/ui/button';
import { Clock, Handshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
          <InfoCard title="Repo" content="18" sub="Public repositories" arrow={false} />
        </div>
      </div>
      <div className="flex-1 p-5">
        <div className="mb-8 flex justify-center p-2 sm:justify-around sm:p-0">
          <div className="relative mt-0 h-80 w-[22rem] sm:w-[30rem]">
            <div className="dark:bg-card h-64 w-full rounded-t-[4rem] rounded-br-[4rem] bg-slate-200/30 py-6 pr-5 pl-8 backdrop-blur-sm">
              <RotateWords text="developer" words={['Web', 'Software', 'Mainframe']} position="behind" />
              <AnimatedWords text="Hello I'm " className="text-left text-xl sm:text-3xl" />
              <AnimatedWords text="Thuong Phan Thanh" className="text-primary text-left text-2xl sm:text-4xl" />
              <p className="text-sm sm:text-base">
                I am a developer skilled in front-end and back-end technologies, specializing in dynamic applications,
                using tools like Next.js, Angular, Java, Spring. I focus on delivering high-quality web experiences.
              </p>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </div>
            <div className="border-primary text-primary hover:bg-accent cursor-pointer rounded-full border p-2.5 hover:border-red-500 hover:text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15 5-3-5-3z" />
              </svg>
            </div>
            <div className="border-primary text-primary hover:bg-accent cursor-pointer rounded-full border p-2.5 hover:border-blue-700 hover:text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 min-[1440px]:justify-between">
          <div className="dark:bg-card flex h-56 flex-1 items-center justify-around rounded-[3rem] bg-slate-200/30 px-4 py-5 min-[1440px]:flex-1 sm:w-10/12 sm:flex-shrink-0 sm:flex-grow-0 sm:px-7">
            <InfoCard title="Github" content="103" sub="Total commits (2025)" />
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
                      <span className="text-4xl text-red-400">7</span>
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
            <p className="ms-2 font-semibold text-white dark:text-black">@piti</p>
            <Image
              className="m-0.5 size-10 rounded-full"
              src="/images/profile-img-with-bg.jpg"
              width={44}
              height={44}
              alt="profile image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
