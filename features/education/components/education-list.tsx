import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { Education } from '@/lib/generated/prisma/client';
import { GraduationCapIcon, PlusIcon } from 'lucide-react';
import { useMemo } from 'react';
import { EducationCard, EducationCardSkeleton } from './education-card';

type BaseProps = {
  data: Education[];
  isLoading: boolean;
  error: Error | null;
};

type EditProps = {
  mode: 'edit';
  onCreate: () => void;
  onEdit: (education: Education) => void;
  onDelete: (education: Education) => void;
};

type DefaultProps = {
  mode?: 'default';
};

type Props = BaseProps & (EditProps | DefaultProps);

export const EducationList = (props: Props) => {
  const { data, isLoading, error, mode = 'default' } = props;
  const { onCreate, onEdit, onDelete } = props as EditProps;

  const displayEducations = useMemo(() => {
    if (!data) return [];
    return data
      .filter((education) => education.isVisible)
      .sort((a, b) => b.displayOrder - a.displayOrder);
  }, [data]);

  return (
    <StateWrapper
      data={displayEducations}
      isLoading={isLoading}
      error={error}
      fallbackLoading={
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <EducationCardSkeleton key={index} />
          ))}
        </div>
      }
      fallbackEmpty={
        <StateUI
          icon={<GraduationCapIcon />}
          title="No Educations Found"
          description="Add your first education to get started."
          actions={
            onCreate ? (
              <Button onClick={onCreate}>
                <PlusIcon />
                Add Education
              </Button>
            ) : undefined
          }
        />
      }
      contentClassName="space-y-2"
    >
      {(educations) => {
        return educations.map((education) => {
          return (
            <EducationCard
              key={education.id}
              education={education}
              mode={mode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        });
      }}
    </StateWrapper>
  );
};
