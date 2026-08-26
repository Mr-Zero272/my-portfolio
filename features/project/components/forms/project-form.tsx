'use client';

import {
  FormDatePicker,
  FormGalleryInput,
  FormInput,
  FormNumber,
  FormSelect,
  FormSlugInput,
  FormSwitch,
  FormTagsInput,
  FormTextArea,
} from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { GalleryImage } from '@/lib/generated/prisma/client';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, AppWindowIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from '../../constants';
import { DEFAULT_PROJECT_FORM_VALUES, ProjectFormSchema, ProjectFormValues } from '../../data';

export const ProjectForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
  context,
}: BaseFormProps<ProjectFormValues, { images?: GalleryImage[] }>) => {
  const id = useId();
  const formId = `project-form-${id}`;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: initialData || DEFAULT_PROJECT_FORM_VALUES,
    mode: 'onTouched',
  });

  const isLocalSubmitting = form.formState.isSubmitting || isSubmitting || false;

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col space-y-2', className)}>
      <FormProvider {...form}>
        {serverErrors?.root && (
          <div className="px-4">
            <Alert variant="error">
              <AlertCircleIcon className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverErrors.root}</AlertDescription>
            </Alert>
          </div>
        )}

        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <FieldGroup className="scroll-fade min-h-0 flex-1 scrollbar-none overflow-x-hidden overflow-y-auto px-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                name="name"
                label="Project Name"
                required
                placeholder="eg: Portfolio v2"
              />
              <FormSlugInput name="slug" label="Slug" sourceName="name" isEditMode={isEditMode} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect name="type" label="Type" options={PROJECT_TYPE_OPTIONS} />
              <FormSelect name="status" label="Status" options={PROJECT_STATUS_OPTIONS} />
            </div>

            <FormGalleryInput
              name="images"
              label="Images"
              multiple
              existing={context?.images}
              pickerTitle="Pick project images"
            />

            <FormTextArea
              name="description"
              label="Description"
              required
              rows={4}
              placeholder="Describe what this project is about..."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput name="demoUrl" label="Demo URL" placeholder="https://..." />
              <FormInput
                name="sourceCodeUrl"
                label="Source Code URL"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormTagsInput
                name="technologies"
                label="Technologies"
                placeholder="Type & press Enter"
              />
              <FormTagsInput name="databases" label="Databases" placeholder="Type & press Enter" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormDatePicker name="startDate" label="Start Date" />
              <FormDatePicker name="endDate" label="End Date" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSwitch
                name="isFeatured"
                label="Featured"
                description="Highlight this project"
              />
              <FormSwitch
                name="isVisible"
                label="Is Visible"
                description="Turn off to hide it from the public page"
              />
            </div>

            <FormNumber name="displayOrder" label="Display Order" min={0} step={1} />
          </FieldGroup>

          {renderSubmitPart?.({ isSubmitting: !!isLocalSubmitting, formId }) ?? (
            <div className="flex items-center justify-end gap-2 px-4 pb-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" form={formId} disabled={isLocalSubmitting}>
                {isLocalSubmitting ? <Spinner /> : <AppWindowIcon />}
                {isLocalSubmitting
                  ? 'Saving...'
                  : isEditMode
                    ? 'Update Project'
                    : 'Create Project'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
