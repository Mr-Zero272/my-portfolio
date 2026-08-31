'use client';

import { Badge } from '@/components/ui/badge';
import { ListProjects } from '../components';
import { useProjects } from '../hooks';

export const ListProjectsPublicPage = () => {
  const { data: projectsData, isLoading: projectsLoading, error: projectsError } = useProjects();

  return (
    <div className="px-4 pb-20 sm:px-8">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            All Projects
          </h2>
          <p className="text-muted-foreground mb-8 text-sm md:text-base lg:max-w-xl">
            Browse my web development projects including React, Next.js, Angular, and Java Spring
            applications. See live demos, source code, and technical implementations.
          </p>
        </div>
      </div>
      <ListProjects
        projects={projectsData?.list ?? []}
        isLoading={projectsLoading}
        error={projectsError}
        mode="public"
      />
    </div>
  );
};
