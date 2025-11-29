import { WorkExperience } from '@/components/work-experience';
import { IExperience } from '@/models';

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
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-wider">Experiences</h1>
      <p className="text-muted-foreground mb-7">Below is my work history and experience as a developer.</p>
      <div className="max-h-[380px] overflow-y-auto pb-10">
        <WorkExperience experiences={experiences as never} />
      </div>
    </div>
  );
};

export default ExperiencesTab;
