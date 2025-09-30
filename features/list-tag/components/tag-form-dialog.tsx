'use client';

import { tagApi } from '@/apis/tag';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/shared/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { generateSlugWithUnique } from '@/lib/slug';
import { type ITag } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema validation
const tagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .min(2, 'Tag name must be at least 2 characters')
    .max(50, 'Tag name cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/, 'Tag name can only contain letters, numbers, and spaces'),
  slug: z.string().optional(), // Slug is optional because it will be generated automatically
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormDialogProps {
  children: React.ReactNode;
  tag?: ITag | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TagFormDialog = ({ children, tag, open, onOpenChange }: TagFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!tag;

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
    },
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: tagApi.createTag,
    onSuccess: () => {
      toast.success('Tạo tag thành công!');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      form.reset();
      onOpenChange?.(false);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo tag');
    },
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TagFormData }) => tagApi.updateTag({ id, data }),
    onSuccess: () => {
      toast.success('Cập nhật tag thành công!');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      form.reset();
      onOpenChange?.(false);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tag');
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (tag && isEditing) {
      form.reset({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
      });
    }
  }, [tag, isEditing, form]);

  const onSubmit = (data: TagFormData) => {
    if (isEditing && tag) {
      updateTagMutation.mutate({
        id: tag._id.toString(),
        data: {
          name: data.name,
          slug: generateSlugWithUnique(data.name),
        },
      });
    } else {
      createTagMutation.mutate({
        data: {
          name: data.name,
          slug: generateSlugWithUnique(data.name),
        },
      });
    }
  };

  const isLoading = createTagMutation.isPending || updateTagMutation.isPending;

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-[425px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{isEditing ? 'Edit tag' : 'Create tag'}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditing
              ? 'Edit tag information. Press save to update changes.'
              : 'Create a new tag. Press save to add the tag to the system.'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên tag..." disabled={isLoading} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ResponsiveDialogFooter>
              <ResponsiveDialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </ResponsiveDialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Progressing...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default TagFormDialog;
