'use client';

import { Github } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IProject } from '@/models';
import { BadgeCheckIcon, EllipsisIcon, FolderGit, GitBranch, Link2, Server } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

const ProjectFeature = ({ projects }: { projects: IProject[] }) => {
  const { data: session } = useSession();
  const [_, copy] = useCopyToClipboard();

  const handleCloneButtonClick = async (url: string) => {
    await copy(`git clone ${url}`);
    toast.success(`git clone ${url} copied to clipboard`);
  };
  // const data = useMemo(
  //   () =>
  //     projects.map((project) => {
  //       return {
  //         title: project.name,
  //         content: <ProjectItem {...project} key={project.id} />,
  //       };
  //     }),
  //   [],
  // );
  return (
    <div className="">
      {/* <Timeline data={data} />
       */}
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            All Projects
          </h2>
          <p className="mb-8 text-sm text-muted-foreground md:text-base lg:max-w-xl">
            Browse my web development projects including React, Next.js, Angular, and Java Spring applications. See live
            demos, source code, and technical implementations.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {projects.map((project) => (
          <Card className="" key={project._id.toString()}>
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="ring-2 ring-ring">
                  <AvatarImage
                    src={session?.user?.image || 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png'}
                    alt={session?.user?.name || 'User'}
                  />
                  <AvatarFallback className="text-xs">{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="flex items-center gap-1 text-sm">
                    {session?.user?.name || 'Unknown'}{' '}
                    <BadgeCheckIcon className="size-4 fill-sky-600 stroke-white dark:fill-sky-400" />
                  </CardTitle>
                  <CardDescription>@{session?.user?.email || 'anonymous'}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCloneButtonClick(project.sourceCodeUrl!)}>
                  <FolderGit />
                  Clone
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Toggle menu">
                      <EllipsisIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <GitBranch className="text-destructive" />
                      Fork
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Server className="text-destructive" />
                      Deploy
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <img
                src={project.thumbnailImage}
                alt={project.name}
                className="aspect-video w-full rounded-md object-cover"
              />
              <p className="wrap-anywhere">
                {project.description}
                {project.technologies.map((tech) => (
                  <span key={tech} className="ark:text-sky-400 text-sky-600">
                    #{tech}
                  </span>
                ))}
              </p>
            </CardContent>
            <CardFooter className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href={project.sourceCodeUrl!}>
                  <Github />
                </Link>
              </Button>
              {project.demoUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={project.demoUrl}>
                    <Link2 />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectFeature;
