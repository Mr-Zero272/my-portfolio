'use client';

import {
  FormComboboxMulti,
  FormGalleryInput,
  FormInput,
  FormNumber,
  FormTagsInput,
  FormTextArea,
} from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { BaseFormProps } from '@/types/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryImage } from '@prisma/client';
import { AlertCircleIcon, SaveIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ProfileFormSchema, ProfileFormValues } from '../../data';


export const ProfileForm = ({
  initialData,
  onSubmit,
  onCancel,
  renderSubmitPart,
  className,
  isSubmitting,
  serverErrors,
  context,
}: BaseFormProps<
  ProfileFormValues,
  {
    heroImage?: GalleryImage;
  }
>) => {
  const id = useId();
  const formId = `profile-form-${id}`;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: initialData,
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput name="name" label="Name" required placeholder="eg: John Doe" />
              <FormNumber
                name="yoe"
                label="Years of Experience"
                step={0.5}
                min={0}
                max={100}
                placeholder="eg: 5"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput name="phone" label="Phone" placeholder="eg: 1234567890" />
              <FormInput name="nationality" label="Nationality" placeholder="eg: Indian" />
            </div>
            <FormInput name="address" label="Address" placeholder="eg: 123 Main St" />
            <FormInput
              name="tagline"
              label="Tagline"
              placeholder="eg: Full Stack Developer"
              description="A short description of what you do"
            />
            <FormTextArea
              name="bio"
              label="Bio"
              placeholder="eg: I am a full stack developer"
              description="A brief introduction about yourself."
            />
            <FormTextArea
              name="description"
              label="Description"
              placeholder="eg: I am a full stack developer"
              description="A longer, more detailed description. Recommended 210 characters."
            />
            <FormTagsInput
              name="rotatingWords"
              label="Rotate words"
              placeholder="eg: Full Stack Developer"
              description="The text will rotate in the hero section. Add a few words or a short phrase to be displayed as rotating text."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormComboboxMulti
                name="languages"
                label="Languages"
                placeholder="eg: English"
                description="The languages that you can communicate in."
                options={[
                  { value: 'english', label: 'English' },
                  { value: 'french', label: 'French' },
                  { value: 'spanish', label: 'Spanish' },
                  { value: 'german', label: 'German' },
                  { value: 'italian', label: 'Italian' },
                  { value: 'portuguese', label: 'Portuguese' },
                  { value: 'russian', label: 'Russian' },
                  { value: 'chinese', label: 'Chinese' },
                  { value: 'japanese', label: 'Japanese' },
                  { value: 'korean', label: 'Korean' },
                  { value: 'vietnamese', label: 'Vietnamese' },
                  { value: 'thai', label: 'Thai' },
                  { value: 'indonesian', label: 'Indonesian' },
                ]}
              />

              <FormInput
                name="cvUrl"
                label="CV URL"
                placeholder="eg: https://example.com/cv"
                description="Download CV link will be displayed in the contact section."
              />
            </div>

            <FormGalleryInput
              name="heroImageId"
              label="Hero Image"
              accept="image/*"
              multiple={false}
              existing={context?.heroImage}
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
                {isLocalSubmitting ? <Spinner /> : <SaveIcon />}
                {isLocalSubmitting ? 'Submitting...' : 'Update profile'}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};
