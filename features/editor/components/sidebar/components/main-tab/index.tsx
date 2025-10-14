import { Separator } from '@/components/ui/separator';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { ChevronRight, Globe, XIcon } from 'lucide-react';

import AuthorMultipleSelect from './components/author-multiple-select';
import ExcerptInput from './components/excerpt-input';
import KeywordsInput from './components/keywords-input';
import PostSlugInput from './components/post-slug-input';
import TagMultipleSelect from './components/tag-multiple-select';

interface MainTabProps {
  onTabChange: (tab: string) => void;
}

const MainTab = ({ onTabChange }: MainTabProps) => {
  return (
    <>
      {/* Post URL Section */}
      <PostSlugInput />

      {/* Authors Section */}
      <AuthorMultipleSelect />

      {/* Tags Section */}
      <TagMultipleSelect />

      {/* Keywords Section */}
      <KeywordsInput />

      {/* Excerpt Section */}
      <ExcerptInput />

      <Separator />

      {/* Menu Items */}
      <SidebarMenu>
        <SidebarMenuItem onClick={() => onTabChange('metadata')}>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-red-500" />
              <span>Metadata</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem onClick={() => onTabChange('x_metadata')}>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <XIcon className="h-4 w-4" />
              <span>X Metadata</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

export default MainTab;
