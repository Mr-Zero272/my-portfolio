'use client';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';
import { Suspense, useCallback } from 'react';
import {
  AboutMeTabs,
  AboutTab,
  EducationTab,
  ExperienceTab,
  SkillTab,
  TabType,
} from '../components';

export const AboutMePage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <AboutMePageContent />
    </Suspense>
  );
};

const AboutMePageContent = () => {
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('about'));

  const handleChangeTab = useCallback(
    (tab: string) => {
      setActiveTab(tab as TabType);
    },
    [setActiveTab],
  );

  return (
    <>
      <section className="relative flex size-full flex-1 flex-col gap-24 p-5 sm:p-10 lg:flex-row">
        <article className="sticky top-12 flex w-full flex-col self-start md:flex-row lg:w-96 lg:flex-col">
          <h1 className="z-1 block w-full text-4xl font-bold sm:text-4xl md:w-1/2 lg:w-full lg:text-6xl">
            All over my details find here...
          </h1>
          <div
            className={cn(
              'absolute -top-4 -left-3 z-0 size-12 rounded-full bg-white sm:size-16 lg:size-20',
              {
                // 'bg-white dark:bg-black': currentColor === 'slate',
              },
            )}
          />
          <div className="mt-10 flex flex-1 flex-row flex-wrap gap-3 md:flex-col">
            <AboutMeTabs activeTab={activeTab as TabType} onTabChange={handleChangeTab} />
          </div>
        </article>
        <article className="flex-1">
          {activeTab === 'about' && <AboutTab />}
          {activeTab === 'education' && <EducationTab />}
          {activeTab === 'skills' && <SkillTab />}
          {activeTab === 'experiences' && <ExperienceTab />}
        </article>
      </section>
    </>
  );
};
