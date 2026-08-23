import { Signature } from '@/components/animations/signature';
import { SlideUpText } from '@/components/animations/slide-up-text';
import { TypingText } from '@/components/animations/typing-text';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Asymmetric 8/4 Split */}
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Content Side */}
            <div data-motion="hero" className="space-y-8 lg:col-span-8" style={{ opacity: 1 }}>
              <Badge variant="secondary" className="ipx-4 py-4 text-base">
                <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                Available for work
              </Badge>
              <SlideUpText
                split="words"
                className="text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl"
                delay={1.5}
              >
                Hi, I&apos;m Thuong Phan Thanh
              </SlideUpText>
              <TypingText
                text={[
                  'Web Developer',
                  'Mobile Developer',
                  'Full Stack Developer',
                  'React Developer',
                  'Next.js Developer',
                  'MERN Stack Developer',
                  'MEAN Stack Developer',
                  'PERN Stack Developer',
                  'MEVN Stack Developer',
                  'React Native Developer',
                  'Flutter Developer',
                  'React Developer',
                  'Next.js Developer',
                  'MERN Stack Developer',
                  'MEAN Stack Developer',
                  'PERN Stack Developer',
                  'MEVN Stack Developer',
                  'React Native Developer',
                  'Flutter Developer',
                ]}
                className="text-2xl font-medium text-slate-700 dark:text-neutral-400"
              />
              <Signature
                className="my-20 py-4 dark:invert-100"
                text="Thuong"
                fontSize={36}
                color="#1D1D1F"
                delay={1.5}
              />
              <SlideUpText
                split="words"
                delay={2}
                className="max-w-2xl text-xl text-slate-600 dark:text-neutral-400"
              >
                Frontend Developer with strong Next.js and modern React experience. Focused on
                building scalable, high-performance apps with clean code, good UI/UX, using
                TypeScript, Tailwind CSS, and popular UI libraries.
              </SlideUpText>
              <div className="flex flex-wrap gap-4">
                <a
                  data-motion="button"
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    filter: 'blur(0px)',
                  }}
                >
                  Book a Session
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  data-motion="button"
                  href="#"
                  className="inline-flex items-center gap-2 font-semibold text-indigo-600 transition-all duration-300 hover:gap-3 dark:text-indigo-400"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    filter: 'blur(0px)',
                  }}
                >
                  View Pricing
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div
                  data-motion="card"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    filter: 'blur(0px)',
                  }}
                >
                  <span className="block text-3xl font-bold text-slate-900 dark:text-white">
                    500+
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400">
                    Episodes Produced
                  </span>
                </div>
                <div
                  data-motion="card"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    filter: 'blur(0px)',
                  }}
                >
                  <span className="block text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    50+
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Active Shows</span>
                </div>
                <div
                  data-motion="card"
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    filter: 'blur(0px)',
                  }}
                >
                  <span className="block text-3xl font-bold text-slate-900 dark:text-white">
                    10M+
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Downloads</span>
                </div>
              </div>
            </div>
            {/* Image Side */}
            <div className="lg:col-span-4">
              <div data-motion="image" className="relative aspect-3/4 overflow-hidden rounded-3xl">
                <Image
                  data-motion="image"
                  src="/images/profile-new.png"
                  alt="Podcast microphone"
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
    </div>
  );
}
