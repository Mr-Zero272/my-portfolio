'use client';

import StateWrapper from '@/components/shared/state-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateTag, useTags } from '@/features/tags/hooks';
import { Tag } from '@/lib/generated/prisma/client';
import { slugify } from '@/lib/slug';
import { handleError } from '@/utils';
import { useDebouncedValue } from '@mantine/hooks';
import { PlusIcon, XIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  useWatch,
} from 'react-hook-form';

export const TagsInput = ({ defaultSelectedTags }: { defaultSelectedTags?: Tag[] }) => {
  const { control } = useFormContext();
  const tagIds: string[] =
    useWatch({
      control,
      name: 'tagIds',
      defaultValue: [],
    }) || [];

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultSelectedTags ?? []);
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebouncedValue(inputValue, 500);

  const {
    data: tagsData,
    isLoading: tagsLoading,
    error: tagsError,
  } = useTags({
    query: {
      page: 1,
      limit: 20,
      search: debouncedInputValue || undefined,
    },
  });

  const { mutateAsync: createTag, isPending: isTagCreating } = useCreateTag();

  const handleSelectTag = (field: ControllerRenderProps<FieldValues, 'tagIds'>, tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) return;
    setSelectedTags((prev) => [...prev, tag]);
    field.onChange([...tagIds, tag.id], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveTag = (field: ControllerRenderProps<FieldValues, 'tagIds'>, tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));
    field.onChange(
      tagIds.filter((t: string) => t !== tagId),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleAddTag = async (field: ControllerRenderProps<FieldValues, 'tagIds'>) => {
    try {
      const tag = await createTag({ body: { name: inputValue, slug: slugify(inputValue) } });
      if (!tag) return;
      setSelectedTags((prev) => [...prev, tag]);
      field.onChange([...tagIds, tag.id], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setInputValue('');
      inputRef.current?.focus();
    } catch (error) {
      handleError({
        error,
        withToast: true,
      });
    }
  };

  const handleKeyPress = async (
    field: ControllerRenderProps<FieldValues, 'tagIds'>,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      if (!inputValue.trim()) return;
      const existingTag = tagsData?.list?.find(
        (tag) => tag.name === inputValue || tag.name.includes(inputValue),
      );
      if (existingTag) {
        handleSelectTag(field, existingTag);
        setInputValue('');
        return;
      }
      // handleAddTag();
    }
  };

  return (
    <Controller
      name="tagIds"
      control={control}
      render={({ field }) => {
        return (
          <Field>
            <FieldLabel htmlFor="tags-input" className="text-sm font-medium">
              Tags
            </FieldLabel>

            <div className="flex gap-2">
              <InputGroup>
                <InputGroupInput
                  id="tags-input"
                  ref={inputRef}
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(field, e)}
                  placeholder="Click to select or type to search..."
                  disabled={isTagCreating}
                />
                {tagsData?.list?.length === 0 && !tagsLoading && !tagsError && (
                  <InputGroupAddon align="inline-end">
                    <Tooltip>
                      <TooltipTrigger render={<Kbd>Ctrl + Enter</Kbd>} />
                      <TooltipContent>
                        <p>Create new tag</p>
                      </TooltipContent>
                    </Tooltip>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </div>

            {selectedTags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-muted-foreground text-xs font-medium">Selected: </span>
                {selectedTags.map((tag) => {
                  return (
                    <Badge
                      key={tag.id}
                      variant="default"
                      className="flex items-center gap-1 py-1 pr-1 pl-2"
                    >
                      <span className="text-xs">{tag.name}</span>
                      <button
                        className="hover:text-destructive rounded-full p-0.5 transition-colors"
                        type="button"
                        onClick={() => handleRemoveTag(field, tag.id)}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            <StateWrapper
              data={tagsData?.list ?? []}
              isLoading={tagsLoading}
              error={tagsError}
              fallbackLoading={
                <div className="flex w-full flex-wrap items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-4 w-20 rounded-full" />
                  ))}
                </div>
              }
              fallbackEmpty={
                <Button
                  size="xs"
                  type="button"
                  variant="outline"
                  className="border-dashed"
                  onClick={() => handleAddTag(field)}
                  disabled={isTagCreating}
                >
                  <PlusIcon />
                  <span>Create new tag</span>
                </Button>
              }
            >
              {(tags) => {
                return (
                  <div className="flex w-full flex-wrap items-center gap-1.5">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.some((t) => t.id === tag.id);
                      if (isSelected) return null;
                      return (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="flex cursor-pointer items-center gap-1 px-2 py-1"
                          onClick={() => handleSelectTag(field, tag)}
                        >
                          <span className="text-xs">{tag.name}</span>
                          {/* <button
                    className="hover:text-destructive rounded-full p-0.5 transition-colors"
                    type="button"
                  >
                    <XIcon className="h-3 w-3" />
                  </button> */}
                        </Badge>
                      );
                    })}
                  </div>
                );
              }}
            </StateWrapper>
          </Field>
        );
      }}
    />
  );
};
