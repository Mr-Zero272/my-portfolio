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
import { GalleryImage } from '@/lib/generated/prisma/client';
import { BaseFormProps } from '@/types/form';
import { GraduationCapIcon } from 'lucide-react';
import { SkillFormValues } from '../../data';
import { SkillForm } from './skill-form';

interface SkillFormDialogProps extends BaseFormProps<SkillFormValues, { icon?: GalleryImage }> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  error?: unknown;
}

export const SkillFormDialog = ({
  open,
  onOpenChange,
  isEditMode,
  isLoading,
  error,
  ...props
}: SkillFormDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex flex-col p-0 sm:max-h-[90vh] sm:max-w-md">
        <ResponsiveDialogHeader className="sm:px-4 sm:pt-4">
          <ResponsiveDialogTitle>
            {isEditMode ? 'Edit Skill' : 'Create Skill'}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditMode ? 'Update the skill details' : 'Add a new skill to the list'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <StateWrapper
          data="skill-form-data"
          isLoading={isLoading ?? false}
          error={error}
          fallbackLoading={
            <div className="flex flex-1 flex-col space-y-4 overflow-hidden sm:px-4 sm:pb-4">
              <FormInputSkeleton />
              <FormInputSkeleton />
              <FormInputSkeleton />
              <FormInputSkeleton />
              <FormInputSkeleton />
              <FormInputSkeleton />
            </div>
          }
          className="flex flex-1 flex-col overflow-hidden"
          contentClassName="flex flex-1 flex-col overflow-hidden sm:px-4"
        >
          {() => (
            <SkillForm
              {...props}
              isEditMode={isEditMode}
              renderSubmitPart={({ isSubmitting, formId }) => (
                <ResponsiveDialogFooter className="sm:mx-0 sm:mb-0">
                  <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" form={formId} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : <GraduationCapIcon />}
                    {isSubmitting ? 'Saving...' : isEditMode ? 'Update Skill' : 'Add Skill'}
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
