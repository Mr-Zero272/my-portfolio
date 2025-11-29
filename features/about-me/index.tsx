'use client';

import CustomCheckbox from '@/components/ui/custom-checkbox';
import { aboutTabs } from '@/constants/about-tabs';
import { IExperience } from '@/models';
import { useState } from 'react';
import AboutTab from './components/about-tab';
import EducationTab from './components/education-tab';
import ExperiencesTab from './components/experiences-tab';
import SkillsTab from './components/skills-tab';

type TabType = 'about' | 'education' | 'skills' | 'experiences';

interface AboutMeFeatureProps {
  experiences: IExperience[];
}

function AboutMeFeature({ experiences }: AboutMeFeatureProps) {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab as TabType);
  };
  return (
    <section className="flex flex-col gap-24 p-5 sm:p-10 lg:flex-row">
      <article className="relative flex w-full flex-col md:flex-row lg:w-96 lg:flex-col">
        <h1 className="z-[1] block w-full text-4xl font-bold sm:text-4xl md:w-1/2 lg:w-full lg:text-6xl">
          All over my details find here...
        </h1>
        <div className="bg-primary absolute -top-4 -left-3 z-0 size-12 rounded-full sm:size-16 lg:size-20"></div>
        <div className="mt-10 flex flex-1 flex-row flex-wrap gap-3 md:flex-col">
          {aboutTabs.map((tab) => (
            <CustomCheckbox
              key={tab.value}
              label={tab.label}
              value={tab.value}
              active={activeTab === tab.value}
              onCheck={handleChangeTab}
            />
          ))}
        </div>
      </article>
      <article className="flex-1">
        {activeTab === 'about' && <AboutTab />}
        {activeTab === 'education' && <EducationTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'experiences' && <ExperiencesTab experiences={experiences} />}
      </article>
    </section>
  );
}

export default AboutMeFeature;
