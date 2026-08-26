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
import { AppWindowIcon } from 'lucide-react';
import { ProjectFormValues } from '../../data';
import { ProjectForm } from './project-form';

interface ProjectFormDialogProps extends BaseFormProps<
  ProjectFormValues,
  { images?: GalleryImage[] }
> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  error?: unknown;
}

export const ProjectFormDialog = ({
  open,
  onOpenChange,
  isLoading,
  error,
  isEditMode,
  ...props
}: ProjectFormDialogProps) => {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex flex-col p-0 sm:max-h-[90vh] sm:max-w-2xl">
        <ResponsiveDialogHeader className="sm:px-4 sm:pt-4">
          <ResponsiveDialogTitle>
            {isEditMode ? 'Edit Project' : 'Create Project'}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isEditMode ? 'Update the project details' : 'Add a new project to the list'}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <StateWrapper
          data="project-form-data"
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
            <ProjectForm
              {...props}
              isEditMode={isEditMode}
              renderSubmitPart={({ isSubmitting, formId }) => (
                <ResponsiveDialogFooter className="sm:mx-0 sm:mb-0">
                  <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" form={formId} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : <AppWindowIcon />}
                    {isSubmitting
                      ? 'Saving...'
                      : isEditMode
                        ? 'Update Project'
                        : 'Add Project'}
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
