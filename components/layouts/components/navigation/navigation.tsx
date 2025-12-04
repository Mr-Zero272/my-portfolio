'use client';
import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';

import { useSidebar } from '@/components/contexts/sidebar-context';
import AppLogo from '@/components/shared/logo';
import { navbarRoutesInfo } from '@/constants/nav-routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOnClickOutside } from 'usehooks-ts';
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
  const sidebarRef = useRef<HTMLElement>(null!);

  const { isExpanded, isCollapsed, isHidden, isMobile, toggle, collapse } = useSidebar();

  const containerControls = useAnimationControls();
  const svgControls = useAnimationControls();

  // Variants cho animation dựa trên trạng thái và screen size
  const containerVariants = useMemo(() => {
    const baseVariants = {
      collapsed: {
        width: '5rem',
        x: '0',
        transition: { type: 'spring' as const, damping: 15, duration: 0.5 },
      },
      expanded: {
        width: '16rem',
        x: '0',
        transition: { type: 'spring' as const, damping: 15, duration: 0.5 },
      },
    };

    if (isMobile) {
      return {
        ...baseVariants,
        hidden: {
          width: '16rem',
          x: '-16rem',
          transition: { type: 'spring' as const, damping: 15, duration: 0.5 },
        },
      };
    }

    return baseVariants;
  }, [isMobile]);

  // Sync animation với state
  useEffect(() => {
    if (isHidden) {
      containerControls.start('hidden');
      svgControls.start('close');
    } else if (isExpanded) {
      containerControls.start('expanded');
      svgControls.start('open');
    } else if (isCollapsed) {
      containerControls.start('collapsed');
      svgControls.start('close');
    }
  }, [containerControls, svgControls, isHidden, isExpanded, isCollapsed]);

  // Click outside để đóng sidebar trên mobile
  const handleClickOutside = () => {
    if (isExpanded) {
      collapse();
    }
  };

  // Handle route navigation trên mobile
  const handleRoutePage = () => {
    if (isMobile && isExpanded) {
      collapse();
    }
  };

  useOnClickOutside(sidebarRef, handleClickOutside);

  return (
    <>
      <motion.nav
        ref={sidebarRef}
        variants={containerVariants}
        animate={containerControls}
        initial={isMobile ? 'hidden' : 'collapsed'}
        className="fixed top-0 left-0 z-50 flex h-full flex-col gap-20 bg-sidebar p-5 shadow-sm"
      >
        <div
          onClick={toggle}
          className="absolute top-0 right-0 h-full w-0.5 cursor-e-resize bg-transparent transition-all hover:bg-black/10 dark:hover:bg-white/10"
        />
        <div className="relative flex w-full flex-row place-items-center justify-between">
          <Link href="/" className="flex justify-center overflow-hidden">
            <AppLogo
              withText
              className={cn('transition-all ease-in-out', {
                'h-10 w-20': isExpanded,
              })}
            />
          </Link>

          <button
            className={cn(
              'absolute top-0 -right-8 flex rounded-full bg-black p-1 transition-all ease-in-out dark:bg-white',
              {
                'right-0': isExpanded,
              },
            )}
            onClick={toggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cn('size-4 stroke-[#E0E4EB] transition-all duration-700 ease-in-out dark:stroke-[#373F4E]', {
                'size-8': isExpanded,
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
              <NavigationLink
                key={navLink.label}
                name={navLink.label}
                href={navLink.route}
                isCollapsed={isCollapsed}
                isHidden={isHidden}
                active={isActive}
                onClick={handleRoutePage}
              >
                <Icon className="w-8 min-w-8 stroke-inherit" strokeWidth={1.5} />
              </NavigationLink>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
