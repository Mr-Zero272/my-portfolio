'use client';

import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import SidebarProvider from '../contexts/sidebar-context';
import { ThemeProvider } from '../contexts/theme-provider';
import { MusicStoreInitializer } from './music-store-initializer';
import ReactQueryProvider from './react-query-provider';

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <MusicStoreInitializer>
        <SidebarProvider>
          <ReactQueryProvider>
            <SessionProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </SessionProvider>
          </ReactQueryProvider>
        </SidebarProvider>
      </MusicStoreInitializer>
    </ThemeProvider>
  );
};

export default AppProvider;
