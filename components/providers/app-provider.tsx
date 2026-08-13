import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { PullCordToggleTheme } from '../shared/pull-cord-toggle-theme';
import { Toaster } from '../ui/sonner';
import { TooltipProvider } from '../ui/tooltip';
import ReactQueryProvider from './react-query-provider';
import { ThemeProvider } from './theme-provider';

type Props = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: Props) => {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <ReactQueryProvider>
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
            <PullCordToggleTheme />
          </ReactQueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
};

export default AppProvider;
