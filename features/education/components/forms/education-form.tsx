'use client';

import {
  FormDatePicker,
  FormInput,
  FormNumber,
  FormSwitch,
  FormTextArea,
} from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  DEFAULT_EDUCATION_FORM_VALUES,
  EducationFormSchema,
  EducationFormValues,
} from '../../data';

export const EducationForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
}: BaseFormProps<EducationFormValues>) => {
  const id = useId();
  const formId = `education-form-${id}`;

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(EducationFormSchema),
    defaultValues: initialData || DEFAULT_EDUCATION_FORM_VALUES,
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
            <FormInput
              name="institution"
              label="Institution"
              required
              placeholder="eg: Stanford University..."
            />

            <FormInput
              name="degree"
              label="Degree"
              required
              placeholder="eg: Master of Science..."
            />

            <FormInput
              name="fieldOfStudy"
              label="Field of Study"
              placeholder="eg: Computer Science..."
            />

            <div className="grid grid-cols-2 gap-2">
              <FormDatePicker
                name="startDate"
                label="Start Date"
                required
                placeholder="eg: 2024-01-01"
              />

              <FormDatePicker
                name="endDate"
                label="End Date"
                placeholder="Present"
                description="Leave empty to indicate current study"
              />
            </div>

            <FormTextArea
              name="description"
              label="Description"
              placeholder="eg: Graduated with honors..."
            />

            <FormInput name="location" label="Location" placeholder="eg: Palo Alto, CA..." />

            <div className="grid grid-cols-2 gap-2">
              <FormNumber name="gpa" label="GPA" min={0} step={0.1} />
              <FormNumber name="gpaScale" label="GPA Scale" min={0} step={0.1} />
            </div>

            <FormNumber name="displayOrder" label="Display Order" min={0} step={1} />

            <FormSwitch
              name="isVisible"
              label="Is Visible"
              description="Turn off to hide it from the public page"
            />
          </FieldGroup>

          {renderSubmitPart?.({ isSubmitting: !!isLocalSubmitting, formId }) ?? (
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={!!isLocalSubmitting}>
                {isLocalSubmitting
                  ? 'Submitting...'
                  : isEditMode
                    ? 'Update Education'
                    : 'Create Education'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
