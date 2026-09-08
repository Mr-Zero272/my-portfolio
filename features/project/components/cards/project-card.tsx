'use client';

import { GithubIcon } from '@/components/icons';
import { ButtonWithAnimatedIcon } from '@/components/shared/button-with-animated-icon';
import CustomFallbackAvatar from '@/components/shared/custom-fallback-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { CalendarDaysIcon, ExternalLinkIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getProjectStatusLabel, getProjectTypeLabel } from '../../constants';
import { ProjectWithAllRelations } from '../../types';

interface ProjectCardProps {
  project: ProjectWithAllRelations;
  mode?: 'public' | 'private';
  renderActions?: (project: ProjectWithAllRelations) => React.ReactNode;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="bg-muted/50 text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-xs">
      #{label}
    </span>
  );
}

export function ProjectCard({ project, mode = 'public', renderActions }: ProjectCardProps) {
  const ownerName = project.user?.name ?? 'Project Owner';
  const ownerSubtitle = project.user?.email ?? project.user?.name ?? 'Portfolio owner';

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex items-center gap-3">
        <Avatar>
          {project.user?.image ? <AvatarImage src={project.user.image} alt={ownerName} /> : null}
          <AvatarFallback>
            <CustomFallbackAvatar name={ownerName} />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate">{project.name}</CardTitle>
          <CardDescription className="truncate">{ownerSubtitle}</CardDescription>
        </div>
        {mode === 'private' && renderActions ? (
          <div className="shrink-0">{renderActions(project)}</div>
        ) : null}
      </CardHeader>

      <div className="px-4">
        {project.images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {project.images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-video overflow-hidden rounded-lg border">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.images.length > 1 ? (
              <>
                <CarouselPrevious className="-left-2" />
                <CarouselNext className="-right-2" />
              </>
            ) : null}
          </Carousel>
        ) : (
          <div className="bg-muted/40 flex aspect-video items-center justify-center rounded-lg border">
            <ImageIcon className="text-muted-foreground size-8" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{getProjectTypeLabel(project.type)}</Badge>
          {mode === 'private' ? (
            <Badge variant="secondary">{getProjectStatusLabel(project.status)}</Badge>
          ) : null}
          {project.startDate ? (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <CalendarDaysIcon className="size-3" />
              {new Date(project.startDate).getFullYear()}
            </span>
          ) : null}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">{project.description}</p>

        {project.technologies.length > 0 || project.databases.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <TagChip key={tech} label={tech} />
            ))}
            {project.databases.map((db) => (
              <TagChip key={db} label={db} />
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="gap-2">
        {project.demoUrl ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <ExternalLinkIcon /> Demo
          </Button>
        ) : null}
        {project.sourceCodeUrl ? (
          <ButtonWithAnimatedIcon
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer" />}
            icon={<GithubIcon />}
          >
            GitHub
          </ButtonWithAnimatedIcon>
        ) : null}
      </CardFooter>
    </Card>
  );
}
