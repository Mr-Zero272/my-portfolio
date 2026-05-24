import React from 'react';
import { TooltipProvider } from '../ui/tooltip';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '../ui/sonner';
import NextTopLoader from 'nextjs-toploader';

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <TooltipProvider>
        {children}
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Toaster />
      </TooltipProvider>
    </NuqsAdapter>
  );
};

export default AppProvider;
