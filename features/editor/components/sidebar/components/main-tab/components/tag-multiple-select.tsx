'use client';

import { tagApi } from '@/apis/tag';
import ErrorMessage from '@/components/shared/error-message';
import { Label } from '@/components/ui/label';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSlugWithUnique } from '@/lib/slug';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePostStorage } from '../../../../../store/use-post-storge';

export const TagMultipleSelect = () => {
  const { tags: tagsFromStorage, setField, errors } = usePostStorage();
  const { data: tags, isLoading: isTagLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags({ page: 1, limit: 100 }),
  });

  const { mutateAsync: createTag } = useMutation({
    mutationFn: tagApi.createTag,
  });

  // Existing tag options - make it stateful so we can add new ones
  const [tagOptions, setTagOptions] = useState<MultiSelectOption[]>([]);

  useEffect(() => {
    if (!isTagLoading && tags) {
      setTagOptions(() => {
        return tags.data.map((tag) => ({
          label: tag.name,
          value: tag._id.toString(),
          icon: Tag,
        }));
      });
    }
  }, [isTagLoading, tags]);

  // Modified createNewTag to also update the options list
  const createNewTag = async (name: string): Promise<MultiSelectOption> => {
    try {
      const res = await createTag({
        data: {
          name,
          slug: generateSlugWithUnique(name),
        },
      });

      const newTag: MultiSelectOption = {
        label: res.data.name,
        value: res.data._id.toString(),
        icon: Tag,
      };

      setTagOptions((prev) => [...prev, newTag]);
      setField('tags', [...(tagsFromStorage || []), newTag.value]);
      return newTag;
    } catch (error) {
      // case error same slug
      if (isAxiosError(error) && error.message.includes('exists')) {
        toast.error(error.message);
      } else {
        toast.error('Error creating tag');
      }
      console.error('Error creating tag:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Tags</Label>
      {isTagLoading ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <MultiSelect
          options={tagOptions}
          onValueChange={(value) => {
            setField('tags', value);
          }}
          defaultValue={tagsFromStorage || []}
          placeholder="Select tags..."
          allowCreateOption={true}
          onCreateOption={createNewTag}
          createOptionLabel={(inputValue) => `Create tag "${inputValue}"`}
          searchable={true}
          className="w-full max-w-[300px]"
        />
      )}
      <ErrorMessage message={errors.tags} />
    </div>
  );
};

export default TagMultipleSelect;
