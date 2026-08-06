'use client';

import StateWrapper from '@/components/shared/state-wrapper';
import { FormInputSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Spinner } from '@/components/ui/spinner';
import { BaseFormProps } from '@/types/form';
import { TagIcon } from 'lucide-react';
import { TagFormValues } from '../../schemas';
import { TagForm } from './tag-form';

interface TagFormDialogProps extends BaseFormProps<TagFormValues> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  error?: unknown;
}

export const TagFormDialog = ({
  open,
  onOpenChange,
  isEditMode,
  isLoading,
  error,
  ...props
}: TagFormDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{isEditMode ? 'Edit Tag' : 'Create Tag'}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditMode ? 'Update the tag details' : 'Add a new tag to the list'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <StateWrapper
          data="tag-form-data"
          isLoading={isLoading ?? false}
          error={error}
          fallbackLoading={
            <div className="space-y-4">
              <FormInputSkeleton />
              <FormInputSkeleton />
            </div>
          }
        >
          {() => (
            <TagForm
              {...props}
              isEditMode={isEditMode}
              renderSubmitPart={({ isSubmitting, formId }) => (
                <ResponsiveDialogFooter className="md:mx-0">
                  <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" form={formId} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : <TagIcon />}
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update tag' : 'Add tag'}
                  </Button>
                </ResponsiveDialogFooter>
              )}
              className="md:-mx-4"
            />
          )}
        </StateWrapper>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
