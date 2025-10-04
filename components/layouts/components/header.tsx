'use client';

import Home from '@/components/icons/home';
import AvatarMenu from '@/components/shared/avatar-menu';
import MusicButton from '@/components/shared/music-button';
import ThemeButton from '@/components/shared/theme-button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import micromatch from 'micromatch';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import SidebarToggle from './navigation/sidebar-toggle';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isInBlogDetailPage = useMemo(() => micromatch.isMatch(pathname || '', '/blog/*'), [pathname]);

  return (
    <div className="fixed top-0 left-1/2 z-20 mt-2 flex -translate-x-1/2 items-center justify-center bg-transparent">
      <ul className="flex w-fit items-center justify-center gap-4 rounded-2xl bg-neutral-100/30 px-3 py-2 backdrop-blur-sm">
        <li className="md:hidden">
          <SidebarToggle />
        </li>
        <li className="md:hidden">
          <Link href="/">
            <AnimatedButton size="icon" variant="ghost">
              <Home className="size-5" />
            </AnimatedButton>
          </Link>
        </li>
        <li>
          <ThemeButton />
        </li>
        <li>
          <MusicButton />
        </li>
        {!isInBlogDetailPage && (
          <li className="min-[1440px]:hidden">
            <AvatarMenu />
          </li>
        )}
        <li>
          <Tooltip>
            <TooltipTrigger asChild>
              <AnimatedButton size="icon" variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="size-5" />
              </AnimatedButton>
            </TooltipTrigger>
            <TooltipContent>Back</TooltipContent>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

export default Header;
