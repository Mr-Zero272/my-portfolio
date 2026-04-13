'use client';

import { tagApi } from '@/apis/tag';
import ErrorMessage from '@/components/shared/error-message';
import { Label } from '@/components/ui/label';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Skeleton } from '@/components/ui/skeleton';
import { generateSlugWithUnique } from '@/utils/slug';
import { useMutation, useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Tag } from 'lucide-react';
import { useEffect, useEffectEvent, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { PostSchema } from '../../../../../schema';

export const TagMultipleSelect = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<PostSchema>();

  const { data: tags, isLoading: isTagLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags({ page: 1, limit: 100 }),
  });

  const { mutateAsync: createTag } = useMutation({
    mutationFn: tagApi.createTag,
  });

  // Existing tag options - make it stateful so we can add new ones
  const [tagOptions, setTagOptions] = useState<MultiSelectOption[]>([]);

  const setTagOptionsEffect = useEffectEvent(() => {
    if (!isTagLoading && tags) {
      setTagOptions(() => {
        return tags.data.map((tag) => ({
          label: tag.name,
          value: tag._id.toString(),
          icon: Tag,
        }));
      });
    }
  });

  useEffect(() => {
    setTagOptionsEffect();
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
      return newTag;
    } catch (error) {
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
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={tagOptions}
              onValueChange={field.onChange}
              defaultValue={field.value || []}
              placeholder="Select tags..."
              allowCreateOption={true}
              onCreateOption={createNewTag}
              createOptionLabel={(inputValue) => `Create tag "${inputValue}"`}
              searchable={true}
              className="w-full max-w-[300px]"
            />
          )}
        />
      )}
      <ErrorMessage message={errors.tags?.message} />
    </div>
  );
};

export default TagMultipleSelect;
