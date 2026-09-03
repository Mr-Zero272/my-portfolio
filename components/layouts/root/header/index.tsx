'use client';

import { ButtonWithTooltip } from '@/components/shared/button-with-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { useRootSidebar } from '@/contexts/root-sidebar.context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsPlaying } from '@/stores/music-store';
import { ArrowLeft, LayoutDashboardIcon, Music2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import picomatch from 'picomatch';
import { useMemo } from 'react';
import { RootSidebarToggle } from '../sidebar';
import { HeaderIsland } from './header-island';
import { MusicPanel } from './music-panel';
import { ThemeToggleButton } from './theme-toggle-button';

const RootHeader = () => {
  const isMobile = useIsMobile();
  const isPlaying = useIsPlaying();
  const pathname = usePathname();
  const router = useRouter();
  const isInBlogDetailPage = useMemo(() => picomatch.isMatch(pathname || '', '/blog/*'), [pathname]);

  // get sidebar state to calculate header position
  const { isCollapsed, isExpanded, isHidden } = useRootSidebar();
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
      <HeaderIsland.Root>
        <Link
          href="/"
          aria-label="Home"
          className={buttonVariants({ size: 'icon', variant: 'ghost' })}
        >
          <LayoutDashboardIcon />
        </Link>

        {/* Sidebar toggle is mobile-only (hidden from the `sm` breakpoint up). */}
        <span className="sm:hidden">
          <RootSidebarToggle />
        </span>

        <ThemeToggleButton />

        <HeaderIsland.Item value="music" aria-label="Music player">
          <Music2 />
          {isPlaying && (
            <span
              aria-hidden
              className="bg-primary absolute -top-0.5 -right-0.5 size-2 animate-pulse rounded-full ring-2 ring-background"
            />
          )}
        </HeaderIsland.Item>

        {isInBlogDetailPage && (
          <ButtonWithTooltip
            tooltip="Back"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft />
          </ButtonWithTooltip>
        )}

        <HeaderIsland.Panel value="music">
          <MusicPanel />
        </HeaderIsland.Panel>
      </HeaderIsland.Root>
    </header>
  );
};

export { RootHeader };

