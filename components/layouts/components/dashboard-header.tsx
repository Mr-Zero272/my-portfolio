'use client';

import AvatarMenu from '@/components/shared/avatar-menu';
import GlobalSearch from '@/components/shared/global-search';
import ThemeButton from '@/components/shared/theme-button';

const DashboardHeader = () => {
  return (
    <>
      <div className="bg-background fixed top-2 mt-1 flex h-16 w-[calc(100%-18rem)] flex-1 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">
            Welcome back, <span className="text-primary">Piti</span>
          </h2>
        </div>
        <div className="relative flex items-center gap-3">
          <GlobalSearch searchPlaceholder="Search all pages, features..." />
          <ThemeButton className="block" />
          <AvatarMenu />
        </div>
      </div>
      <div className="h-20" />
    </>
  );
};

export default DashboardHeader;
