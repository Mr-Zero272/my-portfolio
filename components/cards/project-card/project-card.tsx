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

type Props = {};

const ProjectCard = (props: Props) => {
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
                <SliderProjectImages />
            </div>
            <div className="flex flex-1 flex-col justify-between lg:p-8 2xl:p-16">
                <Collapsible open={isCollapsible} className="w-full" onOpenChange={setIsCollapsible}>
                    <h5 className="text-sm font-medium text-muted-foreground">Project name</h5>
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between">
                            <h1 className="my-3 text-left text-2xl font-semibold">Lorem, ipsum dolor.</h1>
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
                        <span className="font-semibold text-black dark:text-white">Description: </span>The project
                        simulates real-life movie ticket sales, using Spring boot with microservices architecture,
                        Nextjs, Angular, Mongodb and MySql to provide a user-friendly, easy-to-use and high-performance
                        website. Combined with techniques using Kafka and websocket to simulate the seat selection
                        process in real time. Apply Jwt for application security
                    </p>
                    <CollapsibleContent>
                        <p className="mb-1 text-muted-foreground">
                            <span className="font-semibold text-black dark:text-white">Responsibilities: </span>
                            design and implement the entire project yourself.
                        </p>
                        <p className="mb-1 text-muted-foreground">
                            <span className="font-semibold text-black dark:text-white">Technologies: </span>
                            {formatArray<string>([
                                'Next.js',
                                'Angular',
                                'Spring Boot',
                                'Spring Security',
                                'Kafka',
                                'Redis',
                            ])}
                        </p>
                        <p className="mb-5 text-muted-foreground">
                            <span className="font-semibold text-black dark:text-white">Database: </span>
                            {formatArray<string>(['MongoDB, MySql'])}
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
                    <Link href="/" className="text-muted-foreground active:scale-90">
                        <Github className="size-7" />
                    </Link>
                </div>
            </div>
        </figure>
    );
};

export default ProjectCard;
