import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/format';
import { Education } from '@/lib/generated/prisma/client';
import {
  CalendarDaysIcon,
  Edit2Icon,
  GraduationCapIcon,
  MapPinIcon,
  MedalIcon,
  Trash2Icon,
} from 'lucide-react';
import React from 'react';

type BaseProps = {
  education: Education;
};

type EducationCardDefaultProps = BaseProps & {
  mode: 'default';
};

type EducationCardEditProps = BaseProps & {
  mode: 'edit';
  onEdit: (education: Education) => void;
  onDelete: (education: Education) => void;
};

type EducationCardProps = EducationCardDefaultProps | EducationCardEditProps;

export const EducationCard = (props: EducationCardProps) => {
  const { mode, education } = props;

  if (mode === 'edit') {
    const { onEdit, onDelete } = props;

    return (
      <EducationCardContent
        education={education}
        actions={
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Edit"
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(education)}
            >
              <Edit2Icon />
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Delete"
              variant="destructive"
              size="icon-sm"
              onClick={() => onDelete(education)}
            >
              <Trash2Icon />
            </ButtonWithTooltip>
          </div>
        }
      />
    );
  }

  return <EducationCardContent education={education} />;
};

const EducationCardContent = ({
  education,
  actions,
}: {
  education: Education;
  actions?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <GraduationCapIcon className="size-5" />
          </div>
          <div className="">
            <CardTitle>{education.institution}</CardTitle>
            <CardDescription>{`${education.degree} - ${education.fieldOfStudy}`}</CardDescription>
          </div>
        </div>
        <CardAction>{actions}</CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-4" />
            <div className="text-sm">
              {formatDate(education.startDate, 'MMM yyyy')} -{' '}
              {education?.endDate ? formatDate(education.endDate, 'MMM yyyy') : 'Present'}
            </div>
          </div>
          {education.location && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <div className="text-sm">{education.location}</div>
            </div>
          )}
          {education.gpa && (
            <div className="flex items-center gap-2">
              <MedalIcon className="size-4" />
              <div className="text-sm">
                GPA <span className="text-primary font-semibold">{education.gpa}</span>/
                {education.gpaScale}
              </div>
            </div>
          )}
        </div>
        {education.description && (
          <div className="mt-2">
            <p className="text-muted-foreground text-sm">{education.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const EducationCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="">
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-4 w-30" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="text-muted-foreground text-sm">
              <Skeleton className="h-4 w-30" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="text-muted-foreground text-sm">
              <Skeleton className="h-4 w-30" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <div className="text-muted-foreground text-sm">
              <Skeleton className="h-4 w-30" />
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <div className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="text-muted-foreground text-sm">
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
