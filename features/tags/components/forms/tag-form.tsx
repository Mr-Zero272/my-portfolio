'use client';

import { FormInput } from '@/components/forms';
import { FormSlugInput } from '@/components/forms/form-slug-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DEFAULT_TAG_FORM_VALUES, TagFormSchema, TagFormValues } from '../../schemas';

export const TagForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
}: BaseFormProps<TagFormValues>) => {
  const id = useId();
  const formId = `tag-form-${id}`;

  const form = useForm<TagFormValues>({
    resolver: zodResolver(TagFormSchema),
    defaultValues: initialData ?? DEFAULT_TAG_FORM_VALUES,
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
          <FieldGroup className="flex-1 px-4">
            <FormInput name="name" label="Tag name" required placeholder="eg: Nextjs..." />

            <FormSlugInput
              name="slug"
              label="Tag slug"
              required
              placeholder="eg: nextjs..."
              sourceName="name"
              isEditMode={isEditMode}
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
                {isLocalSubmitting ? 'Submitting...' : isEditMode ? 'Update Tag' : 'Create Tag'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
