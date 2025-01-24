import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {};

const ProjectCard = (props: Props) => {
    return (
        <figure className="relative w-64 cursor-pointer">
            <div className="absolute right-1/2 top-0 z-[-1] w-64 translate-x-1/2">
                <Image
                    src="https://i.pinimg.com/736x/8d/82/90/8d8290a5bfcbd76c0e12613dd0f373dd.jpg"
                    alt="project 1"
                    className="z-[-10] h-80 w-64 object-cover shadow-lg"
                    width={240}
                    height={500}
                    quality={100}
                />
            </div>
            <div className="group flex h-80 w-64 flex-col justify-center bg-white p-10 transition-all duration-300 ease-in-out hover:bg-black/75 hover:text-white dark:bg-[#0A0E15] dark:text-white dark:hover:bg-white/30 dark:hover:text-black">
                <p className="mb-3 text-xs">Lorem, ipsum dolor.</p>
                <h1 className="mb-3 text-3xl font-bold">Lorem, ipsum dolor.</h1>
                <div className="mb-3 h-0.5 w-full bg-black group-hover:bg-white dark:bg-white dark:group-hover:bg-black"></div>
                <p className="flex items-center justify-between text-xs hover:underline">
                    More detail{' '}
                    <span>
                        <ArrowRight className="size-4" />
                    </span>
                </p>
            </div>
        </figure>
    );
};

export default ProjectCard;
