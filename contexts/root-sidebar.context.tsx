'use client';

import { MOBILE_BREAKPOINT } from '@/constants/breakpoints';
import { useMediaQuery } from '@mantine/hooks';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

// Định nghĩa các trạng thái sidebar rõ ràng
export type SidebarState = 'hidden' | 'collapsed' | 'expanded';

type SidebarContextType = {
  state: SidebarState;
  isExpanded: boolean;
  isCollapsed: boolean;
  isHidden: boolean;
  isMobile: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
};

const RootSidebarContext = createContext<SidebarContextType>({
  state: 'collapsed',
  isExpanded: false,
  isCollapsed: true,
  isHidden: false,
  isMobile: false,
  toggle: () => {},
  expand: () => {},
  collapse: () => {},
});

export const RootSidebarProvider = ({ children }: Props) => {
  const [desktopState, setDesktopState] = useState<SidebarState>('collapsed');
  const [mobileState, setMobileState] = useState<SidebarState>('hidden');
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);

  // Auto set state based on screen size
  const state = isMobile ? mobileState : desktopState;

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileState((prev) => (prev === 'hidden' ? 'expanded' : 'hidden'));
    } else {
      setDesktopState((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'));
    }
  }, [isMobile]);

  const expand = useCallback(() => {
    if (isMobile) {
      setMobileState('expanded');
    } else {
      setDesktopState('expanded');
    }
  }, [isMobile]);

  const collapse = useCallback(() => {
    if (isMobile) {
      setMobileState('hidden');
    } else {
      setDesktopState('collapsed');
    }
  }, [isMobile]);

  const value = useMemo(
    () => ({
      state,
      isExpanded: state === 'expanded',
      isCollapsed: state === 'collapsed',
      isHidden: state === 'hidden',
      isMobile,
      toggle,
      expand,
      collapse,
    }),
    [state, isMobile, toggle, expand, collapse],
  );

  return <RootSidebarContext value={value}>{children}</RootSidebarContext>;
};

export const useRootSidebar = () => useContext(RootSidebarContext);
