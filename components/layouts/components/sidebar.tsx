'use client';
import React, { useState } from 'react';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ScrollRevealAnimationText from '@/components/animations/ScrollRevealAnimationText';

const Sidebar = () => {
    const [activePage, setActivePage] = useState('home');
    const pathname = usePathname();

    return (
        <div className="sticky left-0 top-0 h-screen w-24 p-3 shadow-md dark:shadow-none max-md:hidden">
            <div className="flex h-full flex-col justify-between">
                <div className="flex justify-center">
                    <p className="text-4xl font-bold">
                        Piti
                        <span className="text-primary">.</span>
                    </p>
                </div>

                <div className="mb-2 flex flex-col items-center gap-y-4">
                    <ScrollRevealAnimationText key={activePage} text={activePage} />
                    {navbarRoutesInfo.map((link) => {
                        const isActive =
                            (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                        const Icon = link.icon;
                        return (
                            <TooltipProvider key={link.label} delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.route}
                                            className={cn(
                                                'group w-fit cursor-pointer rounded-full border p-3 transition-all duration-300 ease-in-out active:scale-90',
                                                { 'bg-gray-100': isActive },
                                            )}
                                            onClick={() =>
                                                setActivePage(() => {
                                                    if (link.route === '') {
                                                        return 'home';
                                                    } else {
                                                        return link.label.toLowerCase();
                                                    }
                                                })
                                            }
                                        >
                                            <Icon
                                                className={cn(
                                                    'duration-400 size-6 text-gray-400 transition-all ease-in-out group-hover:text-black',
                                                    {
                                                        'text-black': isActive,
                                                    },
                                                )}
                                            />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{link.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
