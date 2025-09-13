'use client';

import { Github } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MyAvatar from '@/components/ui/my-avatar';
import { cn, formatArray } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type ProjectItem = {
  name: string;
  images: string[];
  status: string;
  description: string;
  responsibilities: string;
  technologies: Array<string>;
  database: Array<string>;
  sourceCode: string;
};

const ProjectItem = ({
  name,
  images,
  status,
  description,
  responsibilities,
  technologies,
  database,
  sourceCode,
}: ProjectItem) => {
  const [isCollapsible, setIsCollapsible] = useState(false);
  return (
    <>
      <figure className="flex flex-col gap-4 border-b pb-16 md:gap-8 lg:px-0 xl:px-5 2xl:px-10">
        <div className="flex flex-1 flex-col justify-between lg:p-8 2xl:p-16">
          <Collapsible open={isCollapsible} className="w-full" onOpenChange={setIsCollapsible}>
            <h5 className="text-muted-foreground text-sm font-medium capitalize">{status}</h5>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between">
                <h1 className="my-3 text-left text-2xl font-semibold">{name}</h1>
                <Button variant="ghost" className="border-none">
                  <ChevronDown
                    className={cn('size-5 transition-transform duration-200 ease-in-out', {
                      'rotate-180': isCollapsible,
                    })}
                  />
                </Button>
              </div>
            </CollapsibleTrigger>
            <p className="text-muted-foreground mb-5 sm:mb-1">
              <span className="font-semibold text-black dark:text-white">Description: </span>
              {description}
            </p>
            <CollapsibleContent>
              <p className="text-muted-foreground mb-1">
                <span className="font-semibold text-black dark:text-white">Responsibilities: </span>
                {responsibilities}
              </p>
              <p className="text-muted-foreground mb-1">
                <span className="font-semibold text-black dark:text-white">Technologies: </span>
                {formatArray<string>(technologies)}
              </p>
              <p className="text-muted-foreground mb-5">
                <span className="font-semibold text-black dark:text-white">Database: </span>
                {formatArray<string>(database)}
              </p>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <MyAvatar />
              <div className="text-muted-foreground">
                <p className="font-semibold">@Mr-Zero272</p>
                <p className="text-sm">Developer</p>
              </div>
            </div>
            <Link
              href={sourceCode}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground active:scale-90"
            >
              <Github className="size-7" />
            </Link>
          </div>
        </div>
        {/* Images */}
        <PhotoProvider>
          <div className="grid grid-cols-2 gap-5">
            {images.map((image, index) => (
              <PhotoView key={image} src={image}>
                <Image
                  key={index}
                  src={image}
                  alt={name}
                  className="h-full w-full rounded-md object-cover shadow-sm transition-transform hover:scale-105"
                  width={500}
                  height={300}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </figure>
    </>
  );
};

export default ProjectItem;
