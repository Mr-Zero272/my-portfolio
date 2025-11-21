'use client';

import HeaderSettings from '@/components/layouts/components/settings/header-settings';
import SideNavSettings from '@/components/layouts/components/settings/side-nav-settings';
import { useMobileMenuStore } from '@/store/use-mobile-menu-store';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const { isOpen, closeMenu } = useMobileMenuStore();

  return (
    <main className="relative mx-auto flex max-w-[96rem] flex-col">
      <HeaderSettings />
      <div className="relative flex flex-1 items-start gap-10">
        {/* Desktop Sidebar - hidden on mobile */}
        <SideNavSettings className="sticky top-10 hidden w-1/4 min-w-64 md:flex md:w-1/4" />

        {/* Mobile Menu Dialog - only on mobile */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="bg-background/80 fixed inset-0 top-10 z-40 backdrop-blur-sm md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMenu}
              />

              {/* Sidebar Dialog */}
              <motion.div
                className="bg-background fixed top-10 left-0 z-50 h-[calc(100vh-2.5rem)] w-full overflow-y-auto md:hidden"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <SideNavSettings className="w-full px-4" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <div className="pt-6">{children}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsLayout;
