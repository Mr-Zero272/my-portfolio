import { FormTextArea } from '@/components/forms';
import { FormSlugInput } from '@/components/forms/form-slug-input';
import { GoogleIcon, XIcon } from '@/components/icons';
import { FieldGroup } from '@/components/ui/field';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ChevronRightIcon } from 'lucide-react';
import { AuthorsInput } from './authors-input';
import { PostKeywordsInput } from './post-keywords-input';
import { TagsInput } from './tags-input';

export const PostBaseFieldsTab = ({
  onTabChange,
}: {
  onTabChange: (tab: 'main' | 'metadata' | 'x_metadata') => void;
}) => {
  return (
    <div className="flex h-full flex-1 flex-col justify-between">
      <FieldGroup>
        <FormSlugInput
          name="slug"
          label="Post slug"
          sourceName="title"
          placeholder="eg: my-first-post"
          autoComplete="off"
        />

        <TagsInput />

        <PostKeywordsInput />

        <FormTextArea
          name="excerpt"
          label="Excerpt"
          placeholder="Write a short summary of your post..."
        />

        <AuthorsInput />
      </FieldGroup>

      <SidebarMenu className="mt-auto">
        <SidebarMenuItem onClick={() => onTabChange('metadata')}>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <GoogleIcon className="size-4" />
              <span>Metadata</span>
            </div>
            <ChevronRightIcon className="size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem onClick={() => onTabChange('x_metadata')}>
          <SidebarMenuButton className="justify-between">
            <div className="flex items-center gap-2">
              <XIcon className="size-4" />
              <span>X Metadata</span>
            </div>
            <ChevronRightIcon className="size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};
