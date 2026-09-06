'use client';

import {
  FormGalleryInput,
  FormInput,
  FormNumber,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryImage } from '@prisma/client';
import { AlertCircleIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PROFICIENCY_LEVEL_OPTIONS, SKILL_CATEGORY_OPTIONS } from '../../constants';
import { DEFAULT_SKILL_FORM_VALUES, SkillFormSchema, SkillFormValues } from '../../data';

export const SkillForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
  context,
}: BaseFormProps<SkillFormValues, { icon?: GalleryImage }>) => {
  const id = useId();
  const formId = `skill-form-${id}`;

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(SkillFormSchema),
    defaultValues: initialData || DEFAULT_SKILL_FORM_VALUES,
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
            <FormInput name="name" label="Skill Name" required placeholder="eg: React..." />

            <FormSelect
              name="proficiency"
              label="Proficiency"
              required
              options={PROFICIENCY_LEVEL_OPTIONS}
            />

            <FormSelect
              name="category"
              label="Category"
              required
              options={SKILL_CATEGORY_OPTIONS}
            />

            <FormGalleryInput
              name="iconId"
              label="Icon"
              skipCompression
              accept="image/*"
              multiple={false}
              existing={context?.icon}
            />

            <FormTextArea
              name="description"
              label="Description"
              placeholder="eg: Graduated with honors..."
            />

            <FormNumber name="yearsOfExperience" label="Years of Experience" min={0} step={0.1} />

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
                {isLocalSubmitting ? 'Submitting...' : isEditMode ? 'Update Skill' : 'Create Skill'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
