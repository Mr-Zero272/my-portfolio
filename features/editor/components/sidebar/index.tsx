'use client';

import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';
import { useState } from 'react';
import MainTab from './components/main-tab';
import MetadataTab from './components/metadata-tab';
import XMetadataTab from './components/x-metadata-tab';

export function PostSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeTab, setActiveTab] = useState('main');
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const handleCloseSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar
      {...props}
      style={
        {
          ['--sidebar-width' as never]: isMobile ? '100vw' : '350px',
        } as React.CSSProperties
      }
      className="w-full shrink-0 md:w-(--sidebar-width)"
    >
      <SidebarContent className="no-scrollbar scrollbar-none space-y-4 p-6">
        {/* Close button for mobile */}
        {isMobile && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Editor Settings</h2>
            <Button variant="ghost" size="sm" onClick={handleCloseSidebar} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {activeTab === 'main' && <MainTab onTabChange={setActiveTab} />}
        {activeTab === 'metadata' && <MetadataTab onTabChange={setActiveTab} />}
        {activeTab === 'x_metadata' && <XMetadataTab onTabChange={setActiveTab} />}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default PostSidebar;
