import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { Education } from '@/lib/generated/prisma/client';
import { GraduationCapIcon, PlusIcon } from 'lucide-react';
import { EducationCard } from './education-card';

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
  return (
    <StateWrapper
      data={data}
      isLoading={isLoading}
      error={error}
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
