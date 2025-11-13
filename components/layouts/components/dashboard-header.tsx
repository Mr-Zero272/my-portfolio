'use client';

import AvatarMenu from '@/components/shared/avatar-menu';
import GlobalSearch from '@/components/shared/global-search';
import ThemeButton from '@/components/shared/theme-button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useEventListener } from 'usehooks-ts';

const DashboardHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEventListener('scroll', () => {
    setIsScrolled(window.scrollY > 0);
  });

  return (
    <>
      <div
        className={cn(
          'bg-background sticky top-0 z-99999 mt-1 flex h-16 w-full flex-1 items-center justify-between px-8 py-1',
          {
            'backdrop-blur-sm': isScrolled,
          },
        )}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Welcome back, <span className="text-primary">Piti</span>
          </h2>
        </div>
        <div className="relative flex items-center gap-3">
          <GlobalSearch searchPlaceholder="Search all pages, features..." />
          <ThemeButton />
          <AvatarMenu />
        </div>
      </div>
      <div className="h-20" />
    </>
  );
};

export default DashboardHeader;
