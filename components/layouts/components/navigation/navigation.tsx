'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { navbarRoutesInfo } from '@/constants/nav-routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavigationLink from './navigation-link';
import { useSidebar } from '@/components/contexts/sidebar-context';
import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

const svgVariants = {
    close: {
        rotate: 360,
    },
    open: {
        rotate: 180,
    },
};

const Navigation = () => {
    const pathname = usePathname();
    const [windowWidth, setWindowWidth] = useState(0);

    const { isOpen, toggle } = useSidebar();

    const containerControls = useAnimationControls();
    const svgControls = useAnimationControls();

    const debounceWindowWidth = useDebounce(windowWidth, 400);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, []);

    useEffect(() => {
        const updateSize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, [containerControls]);

    const containerVariants = useMemo(() => {
        if (windowWidth === 0) {
            return {
                close: {
                    width: '5rem',
                    x: '-5rem',
                    transition: {
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
                open: {
                    width: '16rem',
                    x: '0',
                    transition: {
                        x: 0,
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
            };
        }
        if (windowWidth <= 768) {
            return {
                close: {
                    width: '5rem',
                    x: '-5rem',
                    transition: {
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
                open: {
                    width: '16rem',
                    x: '0',
                    transition: {
                        x: 0,
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
            };
        } else {
            return {
                close: {
                    width: '5rem',
                    x: '0',
                    transition: {
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
                open: {
                    width: '16rem',
                    x: '0',
                    transition: {
                        type: 'spring',
                        damping: 15,
                        duration: 0.5,
                    },
                },
            };
        }
    }, [windowWidth]);

    useEffect(() => {
        if (containerControls) {
            if (debounceWindowWidth <= 768) {
                containerControls.start('close');
            } else {
                containerControls.start('close');
            }
        }
    }, [containerControls, debounceWindowWidth]);

    useEffect(() => {
        if (isOpen) {
            containerControls.start('open');
            svgControls.start('open');
        } else {
            containerControls.start('close');
            svgControls.start('close');
        }
    }, [isOpen, containerControls, svgControls]);

    const handleOpenClose = () => {
        toggle();
    };

    const handleRoutePage = () => {
        if (windowWidth <= 768) {
            containerControls.start('close');
            svgControls.start('close');
        }
    };

    return (
        <>
            <motion.nav
                variants={containerVariants}
                animate={containerControls}
                initial="close"
                className="absolute left-0 top-0 z-20 flex h-full flex-col gap-20 bg-white p-5 shadow-sm"
            >
                <div className="relative flex w-full flex-row place-items-center justify-between">
                    <Link href="/" className="flex justify-center overflow-hidden">
                        <p className={cn('text-xl font-bold transition-all ease-in-out', { 'text-4xl': isOpen })}>
                            Piti
                            <span className="text-primary">.</span>
                        </p>
                    </Link>

                    <button
                        className={cn(
                            'absolute -right-8 top-0 flex rounded-full bg-black p-1 transition-all ease-in-out',
                            {
                                'right-0': isOpen,
                            },
                        )}
                        onClick={() => handleOpenClose()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={cn('size-4 stroke-neutral-200 transition-all duration-700 ease-in-out', {
                                'size-8': isOpen,
                            })}
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                variants={svgVariants}
                                animate={svgControls}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeInOut',
                                }}
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {navbarRoutesInfo.map((navLink) => {
                        const isActive =
                            (pathname.includes(navLink.route) && navLink.route.length > 1) ||
                            pathname === navLink.route;
                        const Icon = navLink.icon;
                        const IconSolid = navLink.iconSolid;
                        return (
                            <NavigationLink
                                key={navLink.label}
                                name={navLink.label}
                                href={navLink.route}
                                active={isActive}
                                onClick={handleRoutePage}
                            >
                                {isActive ? (
                                    <IconSolid className="w-8 min-w-8 stroke-black" strokeWidth={1.5} />
                                ) : (
                                    <Icon className="w-8 min-w-8 stroke-inherit" strokeWidth={1.5} />
                                )}{' '}
                            </NavigationLink>
                        );
                    })}
                </div>
            </motion.nav>
        </>
    );
};

export default Navigation;
