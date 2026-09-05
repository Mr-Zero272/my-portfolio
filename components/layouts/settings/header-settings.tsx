'use client';

import AppLogo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { HamburgerMenuButton } from './hamburger-menu-button';

export const HeaderSettings = () => {
  const router = useRouter();

  return (
    <div className="bg-background/80 sticky top-0 z-50 h-12 backdrop-blur-sm">
      <div className="flex size-full h-12 w-full max-w-[96rem] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 md:hidden">
            <Tooltip>
              <TooltipTrigger
                render={<Button size="icon" variant="ghost" onClick={() => router.back()} />}
              >
                <ArrowLeft />
              </TooltipTrigger>
              <TooltipContent>
                <p>Quay lại</p>
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />
          </div>
          <Link href="/dashboard" className="flex items-center gap-2">
            <AppLogo className="size-6" />
            <span className="font-medium">
              Settings<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Hamburger menu - only visible on mobile */}
        <div className="md:hidden">
          <HamburgerMenuButton />
        </div>
      </div>
    </div>
  );
};
