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
import { type ITag } from '@/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface TagDeleteConfirmDialogProps {
  children: React.ReactNode;
  tag?: ITag | null;
  tags?: ITag[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TagDeleteConfirmDialog = ({ children, tag, tags, open, onOpenChange }: TagDeleteConfirmDialogProps) => {
  const queryClient = useQueryClient();
  const isMultipleDelete = !!tags && tags.length > 1;
  const isSingleDelete = !!tag;
  const deleteCount = tags?.length || (tag ? 1 : 0);

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: tagApi.deleteTag,
    onSuccess: () => {
      toast.success(isMultipleDelete ? `Đã xóa ${deleteCount} tags thành công!` : 'Xóa tag thành công!');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      onOpenChange?.(false);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa tag');
    },
  });

  // Delete multiple tags mutation
  const deleteMultipleTagsMutation = useMutation({
    mutationFn: async (tagIds: string[]) => {
      const promises = tagIds.map((id) => tagApi.deleteTag({ id }));
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success(`Đã xóa ${deleteCount} tags thành công!`);
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      onOpenChange?.(false);
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa tags');
    },
  });

  const handleDelete = () => {
    if (isMultipleDelete && tags) {
      const tagIds = tags.map((t) => t._id.toString());
      deleteMultipleTagsMutation.mutate(tagIds);
    } else if (isSingleDelete && tag) {
      deleteTagMutation.mutate({ id: tag._id.toString() });
    }
  };

  const isLoading = deleteTagMutation.isPending || deleteMultipleTagsMutation.isPending;

  const getDialogContent = () => {
    if (isMultipleDelete) {
      return {
        title: 'Xóa nhiều tags',
        description: `Bạn có chắc chắn muốn xóa ${deleteCount} tags đã chọn? Hành động này không thể hoàn tác.`,
        tagNames: tags?.map((t) => t.name).join(', ') || '',
      };
    } else if (isSingleDelete) {
      return {
        title: 'Xóa tag',
        description: `Bạn có chắc chắn muốn xóa tag "${tag?.name}"? Hành động này không thể hoàn tác.`,
        tagNames: tag?.name || '',
      };
    } else {
      return {
        title: 'Xóa tag',
        description: 'Không có tag nào được chọn để xóa.',
        tagNames: '',
      };
    }
  };

  const content = getDialogContent();
  const canDelete = (isSingleDelete && tag) || (isMultipleDelete && tags && tags.length > 0);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-[425px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2">
            <Trash2 className="text-destructive h-5 w-5" />
            {content.title}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{content.description}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        {content.tagNames && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-muted-foreground mb-1 text-sm font-medium">
              {isMultipleDelete ? 'Tags sẽ bị xóa:' : 'Tag sẽ bị xóa:'}
            </p>
            <p className="font-mono text-sm">{content.tagNames}</p>
          </div>
        )}

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              Hủy
            </Button>
          </ResponsiveDialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading || !canDelete}>
            {isLoading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default TagDeleteConfirmDialog;
