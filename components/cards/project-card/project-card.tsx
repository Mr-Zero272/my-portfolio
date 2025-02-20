'use client';
import { cn, formatArray } from '@/lib/utils';
import Link from 'next/link';
import { Github } from '../../icons';
import MyAvatar from '../../ui/my-avatar';
import SliderProjectImages from './slider-project-images';
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useDebounce from '@/hooks/use-debounce';

type Props = {
    name: string;
    images: { vertical: Array<string>; horizontal: Array<string> };
    status: string;
    description: string;
    responsibilities: string;
    technologies: Array<string>;
    database: Array<string>;
    sourceCode: string;
    slides: {
        src: string;
        width: number;
        height: number;
        srcSet: {
            src: string;
            width: number;
            height: number;
        }[];
    }[];
};

const ProjectCard = ({
    name,
    images,
    slides,
    status,
    description,
    responsibilities,
    technologies,
    database,
    sourceCode,
}: Props) => {
    const [isCollapsible, setIsCollapsible] = useState(false);

    const [windowWidth, setWindowWidth] = useState(0);
    const windowWidthDebounce = useDebounce(windowWidth, 400);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        const windowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', windowResize);

        return () => {
            window.removeEventListener('resize', windowResize);
        };
    }, []);

    useEffect(() => {
        if (windowWidthDebounce <= 1024) {
            setIsCollapsible(false);
        } else {
            setIsCollapsible(true);
        }
    }, [windowWidthDebounce]);

    return (
        <figure className="flex flex-col gap-4 border-b pb-16 md:gap-8 lg:flex-row lg:px-0 xl:px-5 2xl:px-10">
            <div className="flex-none lg:w-5/12 xl:w-4/12">
                <SliderProjectImages images={images} slides={slides} />
            </div>
            <div className="flex flex-1 flex-col justify-between lg:p-8 2xl:p-16">
                <Collapsible open={isCollapsible} className="w-full" onOpenChange={setIsCollapsible}>
                    <h5 className="text-sm font-medium capitalize text-muted-foreground">{status}</h5>
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between">
                            <h1 className="my-3 text-left text-2xl font-semibold">{name}</h1>
                            <Button variant="outline" className="border-none">
                                <ChevronDown
                                    className={cn('size-5 transition-transform duration-200 ease-in-out', {
                                        'rotate-180': isCollapsible,
                                    })}
                                />
                            </Button>
                        </div>
                    </CollapsibleTrigger>
                    <p className="mb-5 text-muted-foreground sm:mb-1">
                        <span className="font-semibold text-black dark:text-white">Description: </span>
                        {description}
                    </p>
                    <CollapsibleContent>
                        <p className="mb-1 text-muted-foreground">
                            <span className="font-semibold text-black dark:text-white">Responsibilities: </span>
                            {responsibilities}
                        </p>
                        <p className="mb-1 text-muted-foreground">
                            <span className="font-semibold text-black dark:text-white">Technologies: </span>
                            {formatArray<string>(technologies)}
                        </p>
                        <p className="mb-5 text-muted-foreground">
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
                    <Link href={sourceCode} className="text-muted-foreground active:scale-90">
                        <Github className="size-7" />
                    </Link>
                </div>
            </div>
        </figure>
    );
};

export default ProjectCard;
