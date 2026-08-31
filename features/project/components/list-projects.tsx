'use client';

import StateUI from '@/components/shared/state-ui';
import StateWrapper from '@/components/shared/state-wrapper';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ProjectWithAllRelations } from '../types';
import { ProjectCard } from './cards/project-card';

type ListProjectsProps = {
  projects: ProjectWithAllRelations[];
  isLoading?: boolean;
  error?: unknown;
  mode?: 'public' | 'private';
  renderActions?: (project: ProjectWithAllRelations) => React.ReactNode;
  onCreateNew?: () => void;
};

export const ListProjects = ({
  projects,
  isLoading,
  error,
  mode = 'public',
  renderActions,
  onCreateNew,
}: ListProjectsProps) => {
  return (
    <StateWrapper
      data={projects}
      isLoading={isLoading ?? false}
      error={error}
      fallbackEmpty={
        <StateUI
          title="No Projects"
          description={
            mode === 'private'
              ? 'Add your first project to get started'
              : "It's empty here, check back later for more"
          }
          actions={
            mode === 'private' ? (
              <Button onClick={onCreateNew}>
                <PlusIcon />
                Add first project
              </Button>
            ) : undefined
          }
        />
      }
    >
      {(data) => (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              mode={mode}
              renderActions={renderActions}
            />
          ))}
        </div>
      )}
    </StateWrapper>
  );
};
