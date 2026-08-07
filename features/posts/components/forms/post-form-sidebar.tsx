'use client';

import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { PostBaseFieldsTab } from './base-fields/post-base-fields-tab';
import { PostMetaFields } from './meta-fields/post-meta-fields';
import { PostXMetaFields } from './x-meta-fields/post-x-meta-fields';

export const PostFormSidebar = () => {
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const [activeTab, setActiveTab] = useState<'main' | 'metadata' | 'x_metadata'>('main');
  return (
    <Sidebar
      side="right"
      style={
        {
          ['--sidebar-width' as never]: isMobile ? '100vw' : '350px',
        } as React.CSSProperties
      }
      className="w-full shrink-0 md:w-(--sidebar-width)"
    >
      <SidebarContent className="scrollbar-none space-y-4 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
          {/* Close button for mobile */}
          {/* {isMobile && (
           <div className="mb-4 flex items-center justify-between">
             <h2 className="text-lg font-semibold">Editor Settings</h2>
             <Button variant="ghost" size="sm" onClick={handleCloseSidebar} className="h-8 w-8 p-0">
               <X className="h-4 w-4" />
             </Button>
           </div>
         )}
  
         {activeTab === 'main' && <MainTab onTabChange={setActiveTab} />}
         {activeTab === 'metadata' && <MetadataTab onTabChange={setActiveTab} />}
         {activeTab === 'x_metadata' && <XMetadataTab onTabChange={setActiveTab} />} */}

          {/* keep main tab mount to prevent re-fetch api for tags and author */}
          <TabsContent value="main" keepMounted>
            <PostBaseFieldsTab onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="metadata">
            <PostMetaFields onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="x_metadata">
            <PostXMetaFields onTabChange={setActiveTab} />
          </TabsContent>
        </Tabs>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
