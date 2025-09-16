'use client';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useMediaQuery, useWindowSize } from 'usehooks-ts';

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

const SidebarContext = createContext<SidebarContextType>({
  state: 'collapsed',
  isExpanded: false,
  isCollapsed: true,
  isHidden: false,
  isMobile: false,
  toggle: () => {},
  expand: () => {},
  collapse: () => {},
});

const SidebarProvider = ({ children }: Props) => {
  const { width = 0 } = useWindowSize();
  const [state, setState] = useState<SidebarState>('collapsed');

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Auto set state based on screen size
  useEffect(() => {
    if (width === 0) return; // Chờ có width

    if (isMobile) {
      setState('hidden');
    } else {
      setState('collapsed');
    }
  }, [isMobile, width]);

  const toggle = useCallback(() => {
    if (isMobile) {
      setState((prev) => (prev === 'hidden' ? 'expanded' : 'hidden'));
    } else {
      setState((prev) => (prev === 'collapsed' ? 'expanded' : 'collapsed'));
    }
  }, [isMobile]);

  const expand = useCallback(() => {
    setState('expanded');
  }, []);

  const collapse = useCallback(() => {
    if (isMobile) {
      setState('hidden');
    } else {
      setState('collapsed');
    }
  }, [isMobile]);

  const value = {
    state,
    isExpanded: state === 'expanded',
    isCollapsed: state === 'collapsed',
    isHidden: state === 'hidden',
    isMobile,
    toggle,
    expand,
    collapse,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarProvider;
