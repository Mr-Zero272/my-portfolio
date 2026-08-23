'use client';

import { EducationList } from '@/features/education/components';
import { useEducations } from '@/features/education/hooks';
import { cn } from '@/lib/utils';
import { parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { AboutMeTabs, TabType } from '../components';

export const AboutMePage = () => {
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('about'));

  const { data, isLoading: isLoadingEducations, error: errorEducations } = useEducations();

  const handleChangeTab = useCallback(
    (tab: string) => {
      setActiveTab(tab as TabType);
    },
    [setActiveTab],
  );

  const renderDevelopingTab = () => {
    return (
      <div>
        <h1>Developing...</h1>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-24 p-5 sm:p-10 md:h-[calc(100vh-8rem)] lg:flex-row">
      <article className="relative flex w-full flex-col md:flex-row lg:w-96 lg:flex-col">
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
        {activeTab === 'about' && renderDevelopingTab()}
        {activeTab === 'education' && (
          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-wider">Education</h1>
            <p className="mb-7 text-gray-500">
              Below are details of my university studies as well as information about the short
              courses I attended.
            </p>
            <EducationList
              data={data?.list ?? []}
              isLoading={isLoadingEducations}
              error={errorEducations}
              mode="default"
            />
          </div>
        )}
        {activeTab === 'skills' && renderDevelopingTab()}
        {activeTab === 'experiences' && renderDevelopingTab()}
      </article>
    </section>
  );
};
