import { WorkExperience } from '@/components/work-experience';
import { IExperience } from '@/models';
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
  // const { data: experiences = [], isLoading } = useQuery<IExperience[]>({
  //   queryKey: ['experiences', 'list', { owner: true }],
  //   queryFn: async () => {
  //     const data = await experienceApi.getAll({ owner: true });
  //     return data;
  //   },
  // });

  const formattedData = useMemo(() => {
    if (experiences) {
      return experiences.map((ex) => ({
        ...ex,
        positions: ex.positions.map((p) => ({ ...p, isExpanded: true })),
      }));
    }
  }, [experiences]);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
      <p className="mb-7 text-muted-foreground">Below is my work history and experience as a developer.</p>
      <div className="pb-10">
        {/* {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div className="" key={index}>
              <Skeleton className="mb-3 h-5 w-40" />
              <Skeleton className="mb-2 h-5 w-56" />
              <Skeleton className="mb-2 h-5 w-72" />
              <Skeleton className="mb-2 h-5 w-56" />
              <Skeleton className="mb-2 h-5 w-72" />
            </div>
          ))} */}
        <WorkExperience experiences={formattedData as never} />
      </div>
    </div>
  );
};

export default ExperiencesTab;
