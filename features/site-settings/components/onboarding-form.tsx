'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  SiteSettingOnboardingFormInput,
  SiteSettingOnboardingInput,
} from '@/features/site-settings/schemas/site-setting.schema';
import { siteSettingOnboardingSchema } from '@/features/site-settings/schemas/site-setting.schema';
import { handleError } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { useCreateOnboardingSettings } from '../hooks';

export function OnboardingForm() {
  const router = useRouter();
  const { mutateAsync: createOnboardingSettings, isPending } = useCreateOnboardingSettings();
  const form = useForm<SiteSettingOnboardingFormInput, unknown, SiteSettingOnboardingInput>({
    resolver: zodResolver(siteSettingOnboardingSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      githubUsername: '',
    },
  });

  const handleSubmit = async (data: SiteSettingOnboardingInput) => {
    try {
      await createOnboardingSettings(data);
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <form className="grid gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        control={form.control}
        name="siteName"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="siteName">Site name</FieldLabel>
            <Input
              id="siteName"
              placeholder="My Portfolio"
              data-error={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="siteDescription"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="siteDescription">Description</FieldLabel>
            <Textarea
              id="siteDescription"
              placeholder="A short intro for search engines and social previews."
              data-error={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="siteUrl"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="siteUrl">Site URL</FieldLabel>
            <Input
              id="siteUrl"
              placeholder="https://example.com"
              data-error={fieldState.invalid}
              {...field}
            />
            <FieldDescription>Used later for canonical links and Open Graph URLs.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="githubUsername"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="githubUsername">GitHub username</FieldLabel>
            <Input
              id="githubUsername"
              placeholder="octocat"
              data-error={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {form.formState.errors.root?.message && (
        <FieldError>{form.formState.errors.root.message}</FieldError>
      )}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Finishing setup...' : 'Finish setup'}
      </Button>
    </form>
  );
}
