'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSidebar } from '@/components/contexts/sidebar-context';
import AppLogo from '@/components/shared/logo';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavigationLink from './navigation-link';

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
  const sidebarRef = useRef<HTMLElement>(null);

  const { isOpen, toggle, close, setHiddenState, isHidden } = useSidebar();

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
  }, []);

  useEffect(() => {
    if (debounceWindowWidth === 0) {
      setHiddenState(false);
    } else if (debounceWindowWidth <= 768) {
      setHiddenState(true);
    } else {
      setHiddenState(false);
    }
  }, [debounceWindowWidth, setHiddenState]);

  const containerVariants = useMemo(() => {
    return debounceWindowWidth <= 768
      ? {
          close: { width: '5rem', x: '-5rem', transition: { type: 'spring' as const, damping: 15, duration: 0.5 } },
          open: { width: '16rem', x: '0', transition: { x: 0, type: 'spring' as const, damping: 15, duration: 0.5 } },
        }
      : {
          close: { width: '5rem', x: '0', transition: { type: 'spring' as const, damping: 15, duration: 0.5 } },
          open: { width: '16rem', x: '0', transition: { x: 0, type: 'spring' as const, damping: 15, duration: 0.5 } },
        };
  }, [debounceWindowWidth]);

  useEffect(() => {
    if (containerControls) {
      if (debounceWindowWidth <= 768) {
        containerControls.start('close');
        svgControls.start('close');
      } else {
        containerControls.start('close');
        svgControls.start('close');
      }
    }
  }, [containerControls, svgControls, debounceWindowWidth]);

  useEffect(() => {
    if (isOpen) {
      containerControls.start('open');
      svgControls.start('open');
    } else {
      containerControls.start('close');
      svgControls.start('close');
    }
  }, [isOpen, containerControls, svgControls]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        containerControls.start('close');
        svgControls.start('close');
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef, containerControls, svgControls, close]);

  const handleOpenClose = () => {
    toggle();
  };

  const handleRoutePage = () => {
    if (windowWidth <= 768) {
      containerControls.start('close');
      svgControls.start('close');
      close();
    }
  };

  return (
    <>
      <motion.nav
        ref={sidebarRef}
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className="bg-card absolute top-0 left-0 z-50 flex h-full flex-col gap-20 p-5 shadow-sm"
      >
        <div className="relative flex w-full flex-row place-items-center justify-between">
          <Link href="/" className="flex justify-center overflow-hidden">
            <AppLogo
              withText
              className={cn('transition-all ease-in-out', {
                'h-10 w-20': isOpen,
              })}
            />
            {/* <p className={cn('text-xl font-bold transition-all ease-in-out', { 'text-4xl': isOpen })}>
              Piti
              <span className="text-primary">.</span>
            </p> */}
          </Link>

          <button
            className={cn(
              'absolute top-0 -right-8 flex rounded-full bg-black p-1 transition-all ease-in-out dark:bg-white',
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
              className={cn('size-4 stroke-[#E0E4EB] transition-all duration-700 ease-in-out dark:stroke-[#373F4E]', {
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
              (pathname.includes(navLink.route) && navLink.route.length > 1) || pathname === navLink.route;
            const Icon = navLink.icon;
            const IconSolid = navLink.iconSolid;
            return (
              <Tooltip key={navLink.label}>
                <TooltipTrigger asChild>
                  <div>
                    <NavigationLink
                      name={navLink.label}
                      href={navLink.route}
                      active={isActive}
                      onClick={handleRoutePage}
                    >
                      {isActive ? (
                        <IconSolid className="w-8 min-w-8 stroke-transparent dark:fill-white" strokeWidth={1.5} />
                      ) : (
                        <Icon className="w-8 min-w-8 stroke-inherit" strokeWidth={1.5} />
                      )}{' '}
                    </NavigationLink>
                  </div>
                </TooltipTrigger>
                {!isOpen && !isHidden && (
                  <TooltipContent side="right">
                    <p className="text-sm">{navLink.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
