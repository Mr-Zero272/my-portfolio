'use client';

import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { lexicalJsonToHtml } from '@/components/ui/rich-text-editor';
import { formatDate } from '@/lib/format';
import { CodeXmlIcon, PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ExperienceWithAllRelations } from '../types';
import { ExperienceItemType, ExperiencePositionItemType, WorkExperience } from './work-experience';

type ListWorkExperienceProps = {
  experiences: ExperienceWithAllRelations[];
  isLoading?: boolean;
  error?: unknown;
  mode?: 'public' | 'private';
  renderActions?: (experience: ExperienceWithAllRelations) => React.ReactNode;
  onCreateNew?: () => void;
};

export const ListWorkExperience = ({
  experiences,
  isLoading,
  error,
  mode,
  renderActions,
  onCreateNew,
}: ListWorkExperienceProps) => {
  const experiencesData = useMemo(() => {
    return experiences.map((experience, index) => {
      return {
        id: experience.id,
        companyName: experience.companyName,
        companyLogo: experience.companyLogo?.url,
        companyWebsite: experience.companyWebsite ?? undefined,
        positions: experience.positions.map(
          (position): ExperiencePositionItemType => ({
            id: position.title,
            title: position.title,
            employmentPeriod: {
              start: formatDate(position.startDate, 'MM.yyyy'),
              end: position.endDate ? formatDate(position.endDate, 'MM.yyyy') : undefined,
            },
            employmentType: position.employmentType ?? undefined,
            icon: <CodeXmlIcon />,
            description: position.description ? lexicalJsonToHtml(position.description) : undefined,
            skills: position.skills,
            isExpanded: index === 0,
            actions: mode === 'private' ? renderActions?.(experience) : undefined,
          }),
        ),
        isCurrentEmployer: experience.isCurrentEmployer,
      } satisfies ExperienceItemType;
    }) satisfies ExperienceItemType[];
  }, [experiences, renderActions, mode]);
  return (
    <StateWrapper
      data={experiencesData}
      isLoading={isLoading ?? false}
      error={error}
      fallbackEmpty={
        <StateUI
          title="No Work Experience"
          description="Add your first work experience to get started"
          actions={
            <Button onClick={onCreateNew}>
              <PlusIcon />
              Add first work experience
            </Button>
          }
        />
      }
    >
      {(data) => {
        return <WorkExperience experiences={data} className="w-full" />;
      }}
    </StateWrapper>
  );
};
