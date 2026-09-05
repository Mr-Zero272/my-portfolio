'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, SaveIcon } from 'lucide-react';
import { useId } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { FormInput } from '@/components/forms';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

import { accountInfoSchema, type AccountInfoFormValues } from '../schemas';

type AccountInfoFormProps = {
  initialData?: Partial<AccountInfoFormValues>;
  isSubmitting?: boolean;
  serverError?: string;
  onSubmit: (values: AccountInfoFormValues) => Promise<void> | void;
};

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export const AccountInfoForm = ({
  initialData,
  isSubmitting,
  serverError,
  onSubmit,
}: AccountInfoFormProps) => {
  const id = useId();
  const formId = `account-info-form-${id}`;

  const form = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      image: initialData?.image ?? '',
    },
    mode: 'onTouched',
  });

  const name = useWatch({ control: form.control, name: 'name' });
  const image = useWatch({ control: form.control, name: 'image' });
  const isBusy = form.formState.isSubmitting || isSubmitting || false;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <FormProvider {...form}>
        {serverError && (
          <Alert variant="error">
            <AlertCircleIcon className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <FieldGroup className="flex-1">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={image || undefined} alt={name || 'Avatar'} />
                <AvatarFallback>{initialsOf(name)}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                This avatar is shown in the dashboard sidebar and as the default author
                image.
              </p>
            </div>

            <FormInput name="name" label="Name" required placeholder="eg: Piti Thuong" />
            <FormInput
              name="image"
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
              description="Temporary: paste an image URL. Leave empty to remove the avatar."
            />
          </FieldGroup>

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isBusy}>
              {isBusy ? <Spinner /> : <SaveIcon />}
              {isBusy ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
