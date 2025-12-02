import { experienceApi } from '@/apis/experience';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkExperience } from '@/components/work-experience';
import { useQuery } from '@tanstack/react-query';

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

const ExperiencesTab = () => {
  const { data: experiences = [], isLoading } = useQuery<any[]>({
    queryKey: ['experiences', 'list', { owner: true }],
    queryFn: async () => {
      const data = await experienceApi.getAll({ owner: true });
      return data;
    },
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
      <p className="mb-7 text-muted-foreground">Below is my work history and experience as a developer.</p>
      <div className="max-h-[380px] overflow-y-auto pb-10">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div className="" key={index}>
              <Skeleton className="mb-3 h-5 w-40" />
              <Skeleton className="mb-2 h-5 w-56" />
              <Skeleton className="mb-2 h-5 w-72" />
              <Skeleton className="mb-2 h-5 w-56" />
              <Skeleton className="mb-2 h-5 w-72" />
            </div>
          ))}
        {!isLoading && experiences && <WorkExperience experiences={experiences as never} />}
      </div>
    </div>
  );
};

export default ExperiencesTab;
