'use client';

import { FormInput, FormNumber, FormSelect, FormSwitch } from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SOCIAL_LINK_PLATFORM_OPTIONS } from '../../constants';
import {
  DEFAULT_SOCIAL_LINK_FORM_VALUES,
  SocialLinkFormSchema,
  SocialLinkFormValues,
} from '../../data';

export const SocialLinkForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  isEditMode,
}: BaseFormProps<SocialLinkFormValues>) => {
  const id = useId();
  const formId = `social-link-form-${id}`;

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(SocialLinkFormSchema),
    defaultValues: initialData || DEFAULT_SOCIAL_LINK_FORM_VALUES,
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
            <FormSelect
              name="platform"
              label="Platform"
              required
              options={SOCIAL_LINK_PLATFORM_OPTIONS}
            />

            <FormInput
              name="url"
              label="URL"
              required
              placeholder="e.g. https://github.com/yourhandle"
            />

            <FormInput name="username" label="Username" placeholder="e.g. yourhandle" />

            <FormNumber name="displayOrder" label="Display Order" min={0} step={1} />

            <FormSwitch
              name="isActive"
              label="Active"
              description="Turn off to hide it from the site"
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
                    ? 'Update Social Link'
                    : 'Create Social Link'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
