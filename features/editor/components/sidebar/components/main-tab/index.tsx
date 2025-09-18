import { Separator } from '@/components/ui/separator';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';

import { ChevronRight, Globe, Star, XIcon } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { usePostStorage } from '@/features/editor/store/use-post-storge';
import ExcerptInput from './components/excerpt-input';
import PostSlugInput from './components/post-slug-input';
import TagMultipleSelect from './components/tag-multiple-select';

interface MainTabProps {
  onTabChange: (tab: string) => void;
}

const MainTab = ({ onTabChange }: MainTabProps) => {
  const { published, setField } = usePostStorage();
  return (
    <>
      {/* Post URL Section */}
      <PostSlugInput />

      {/* Tags Section */}
      <TagMultipleSelect />

      {/* Excerpt Section */}
      <ExcerptInput />

      <Separator />

      {/* Published */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star
            className={cn('h-4 w-4', {
              'fill-yellow-500 text-yellow-500': !!published,
            })}
          />
          <span className="text-sm font-medium">Published this post</span>
        </div>
        <Switch checked={!!published} onCheckedChange={(checked) => setField('published', checked)} />
      </div>

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
