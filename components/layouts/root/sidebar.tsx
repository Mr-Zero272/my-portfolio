'use client';
import AppLogo from '@/components/shared/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { rootNavigation } from '@/constants/navigation';
import { useRootSidebar } from '@/contexts/root-sidebar.context';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@mantine/hooks';
import { GaugeIcon } from 'lucide-react';
import { motion, useAnimationControls } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export const RootSidebar = () => {
  const pathname = usePathname();
  const { isExpanded, isCollapsed, isHidden, isMobile, toggle, collapse } = useRootSidebar();

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

  const sidebarRef = useClickOutside(handleClickOutside);

  return (
    <>
      <motion.nav
        ref={sidebarRef}
        variants={containerVariants}
        animate={containerControls}
        initial={isMobile ? 'hidden' : 'collapsed'}
        className={cn(
          'group/sidebar bg-sidebar fixed top-0 left-0 z-50 flex h-dvh flex-col rounded-lg shadow-sm',
          {
            'bg-transparent shadow-none': isCollapsed,
          },
        )}
      >
        <div
          onClick={toggle}
          className={cn(
            'absolute top-0 right-0 h-full w-0.5 cursor-e-resize bg-transparent transition-all group-hover/sidebar:bg-black/10 hover:bg-black/10 group-hover/sidebar:dark:bg-white/10 dark:hover:bg-white/10',
            {
              'w-0': isCollapsed,
            },
          )}
        />
        <div className="relative flex w-full flex-row place-items-center justify-between p-5">
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
              'absolute top-3 -right-4 flex rounded-full bg-black p-1 transition-all ease-in-out dark:bg-white',
              {
                'top-3 right-4': isExpanded,
              },
            )}
            onClick={toggle}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={cn(
                'size-4 stroke-[#E0E4EB] transition-all duration-700 ease-in-out dark:stroke-[#373F4E]',
                {
                  'size-8': isExpanded,
                },
              )}
              variants={{
                close: {
                  rotate: 0,
                },
                open: {
                  rotate: 180,
                },
              }}
              animate={svgControls}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </motion.svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-between overflow-y-auto">
          <ScrollArea className="flex w-full flex-1 flex-col items-center overflow-x-hidden overflow-y-auto">
            <div
              className={cn('flex w-full flex-col items-center justify-center gap-2 p-5', {
                'bg-sidebar m-3 w-fit gap-3 rounded-full p-2': isCollapsed,
              })}
            >
              {isExpanded && (
                <div className="font-poppins mb-2 w-full pl-1 text-left text-xs font-medium text-slate-600">
                  General
                </div>
              )}
              {rootNavigation.main.map((navLink) => {
                const isActive =
                  (pathname.includes(navLink.href) && navLink.href.length > 1) ||
                  pathname === navLink.href;
                const Icon = navLink.icon;
                // const IconSolid = navLink.iconSolid;
                return (
                  <SidebarItem
                    key={navLink.label}
                    name={navLink.label}
                    href={navLink.href}
                    isCollapsed={isCollapsed}
                    isHidden={isHidden}
                    active={isActive}
                    onClick={handleRoutePage}
                    icon={<Icon className="w-8 min-w-8 stroke-inherit" strokeWidth={1.5} />}
                  />
                );
              })}
            </div>
            <div
              className={cn('flex w-full flex-col items-center justify-center gap-2 p-5', {
                'bg-sidebar m-3 w-fit gap-3 rounded-full p-2': isCollapsed,
              })}
            >
              {isExpanded && (
                <div className="font-poppins mb-2 w-full pl-1 text-left text-xs font-medium text-slate-600">
                  Setting
                </div>
              )}
              {rootNavigation.secondary.map((navLink) => {
                const isActive =
                  (pathname.includes(navLink.href) && navLink.href.length > 1) ||
                  pathname === navLink.href;
                const Icon = navLink.icon;
                // const IconSolid = navLink.iconSolid;
                return (
                  <SidebarItem
                    key={navLink.label}
                    name={navLink.label}
                    href={navLink.href}
                    isCollapsed={isCollapsed}
                    isHidden={isHidden}
                    active={isActive}
                    onClick={handleRoutePage}
                    icon={<Icon className="w-8 min-w-8" strokeWidth={1.5} />}
                  />
                );
              })}
            </div>
          </ScrollArea>
          <div className="w-full p-3">
            <div className="cursor-pointer space-y-4 rounded-2xl bg-black p-4 transition-transform ease-in-out active:scale-95 dark:bg-white">
              <GaugeIcon className="size-6 text-white dark:text-black" />
              {isExpanded && (
                <div>
                  <h3 className="font-poppins text-sm font-medium text-white dark:text-black">
                    Get your own portfolio
                  </h3>
                  <span className="text-xs font-normal text-white dark:text-black">
                    Create your own portfolio in minutes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

interface SidebarItemProps {
  href: string;
  name: string;
  isCollapsed?: boolean;
  isHidden?: boolean;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const SidebarItem = ({
  name,
  href,
  isCollapsed = false,
  isHidden = false,
  active = false,
  onClick = () => {},
  icon,
}: SidebarItemProps) => {
  if (!isCollapsed && !isHidden) {
    return (
      <Link
        href={href}
        className={cn(
          'flex w-full cursor-pointer place-items-center gap-3 overflow-clip rounded-md stroke-neutral-400 stroke-[0.75] p-1 text-clip text-neutral-400 transition-colors duration-100 hover:bg-[#f2f2f2] hover:stroke-black hover:text-black/80',
          {
            'bg-primary hover:bg-primary text-background hover:text-background [&_svg]:stroke-background':
              active,
          },
        )}
        onClick={onClick}
      >
        {icon}
        {!isCollapsed && (
          <p className="font-poppins overflow-clip tracking-wide whitespace-nowrap text-inherit">
            {name}
          </p>
        )}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            className={cn(
              'flex size-11 cursor-pointer place-items-center items-center justify-center gap-3 overflow-clip rounded-full stroke-neutral-400 stroke-[0.75] p-1 text-clip text-neutral-400 transition-colors duration-100 hover:bg-[#f2f2f2] hover:stroke-black hover:text-black/80 [&_svg]:size-5',
              {
                'bg-primary text-background hover:bg-primary hover:text-background hover:[&_svg]:text-background hover:[&_svg]:stroke-background dark:[&_svg]:stroke-background':
                  active,
              },
            )}
            onClick={onClick}
          >
            {icon}
            {!isCollapsed && (
              <p className="font-poppins overflow-clip tracking-wide whitespace-nowrap text-inherit">
                {name}
              </p>
            )}
          </Link>
        }
      ></TooltipTrigger>

      <TooltipContent side="right">
        <p className="text-sm">{name}</p>
      </TooltipContent>
    </Tooltip>
  );
};
