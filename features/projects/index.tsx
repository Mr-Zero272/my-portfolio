import { Timeline } from '@/components/ui/timeline';
import { projects } from '@/constants/projects-info';
import { useMemo } from 'react';
import ProjectItem from './components/project-item';

const ProjectFeature = () => {
  const data = useMemo(
    () =>
      projects.map((project) => {
        return {
          title: project.name,
          content: <ProjectItem {...project} key={project.id} />,
        };
      }),
    [],
  );
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
};

export default ProjectFeature;
