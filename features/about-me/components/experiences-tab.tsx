import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkExperience } from '@/components/work-experience';
import { cn } from '@/lib/utils';
import { IExperience } from '@/models';
import { format } from 'date-fns';
import { useMemo } from 'react';

const experiences = [
  {
    time: '05/2024 – 07/2024',
    company: 'Fujinet System company',
    position: 'Internship',
  },
  {
    time: '03/2025 – current',
    company: 'Teknix Corporation',
    position: 'Frontend Developer',
  },
];

interface ExperiencesTabProps {
  experiences: IExperience[];
}

const ExperiencesTab = ({ experiences }: ExperiencesTabProps) => {
  const formattedData = useMemo(() => {
    if (experiences) {
      return experiences.map((ex) => ({
        ...ex,
        positions: ex.positions.map((p) => ({
          ...p,
          isExpanded: true,
          employmentPeriod: `${format(p.startDate, 'MMM yyyy')} - ${
            p.endDate ? format(p.endDate, 'MMM yyyy') : 'Present'
          }`,
        })),
      }));
    }
  }, [experiences]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
      <p className="mb-7 text-muted-foreground">Below is my work history and experience as a developer.</p>
      <ScrollArea className={cn('flex-1 overflow-y-auto', { 'md:pr-2.5': experiences.length > 3 })}>
        <WorkExperience experiences={formattedData as never} />
      </ScrollArea>
    </div>
  );
};

export default ExperiencesTab;
