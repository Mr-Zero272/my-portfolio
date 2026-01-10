'use client';

import { useSidebar } from '@/components/contexts/sidebar-context';
import Home from '@/components/icons/home';
import AvatarMenu from '@/components/shared/avatar-menu';
import MusicButton from '@/components/shared/music-button';
import ThemeButton from '@/components/shared/theme-button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft } from 'lucide-react';
import micromatch from 'micromatch';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import SidebarToggle from './navigation/sidebar-toggle';

const Header = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const isInBlogDetailPage = useMemo(() => micromatch.isMatch(pathname || '', '/blog/*'), [pathname]);

  // get sidebar state to calculate header position
  const { isCollapsed, isExpanded, isHidden } = useSidebar();
  const sidebarWidth = useMemo(() => {
    if (isHidden) return '0rem';
    if (isCollapsed) return '5rem';
    if (isExpanded) return '5rem';
    return '0';
  }, [isHidden, isCollapsed, isExpanded]);

  const sidebarWidthCal = useMemo(() => {
    if (isMobile) return '0rem';
    return sidebarWidth;
  }, [isMobile, sidebarWidth]);

  return (
    <header
      className="fixed top-4 z-20 flex -translate-x-1/2 items-center justify-center bg-transparent"
      style={{
        left: `calc(${sidebarWidthCal} + (100% - ${sidebarWidthCal}) / 2)`,
      }}
    >
      <motion.ul
        layout
        key="header"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className="flex w-fit items-center justify-center gap-2 rounded-full bg-neutral-100/30 px-3 py-2 backdrop-blur-sm"
      >
        <AnimatePresence mode="popLayout">
          <motion.li key="sidebar-toggle" className="md:hidden">
            <SidebarToggle />
          </motion.li>
          <motion.li
            key="home"
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="md:hidden"
          >
            <Link href="/">
              <AnimatedButton size="icon" variant="ghost">
                <Home className="size-5" />
              </AnimatedButton>
            </Link>
          </motion.li>
          <motion.li
            key={'theme-button' + theme}
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <ThemeButton />
          </motion.li>
          <motion.li
            key="music-button"
            layout
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <MusicButton />
          </motion.li>
          {!isInBlogDetailPage && (
            <motion.li
              layout
              key="avatar"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              className="min-[1440px]:hidden"
            >
              <AvatarMenu />
            </motion.li>
          )}
          {isInBlogDetailPage && (
            <motion.li
              layout
              key="back"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <AnimatedButton size="icon" variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="size-5" />
                  </AnimatedButton>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
    </header>
  );
};

export default Header;
