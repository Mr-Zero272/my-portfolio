'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { BaseInputProps } from '@/types/form';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export function FormCheckbox({ required, name, label, description, disabled }: BaseInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal">
          <Checkbox
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />
          <FieldContent>
            {label && <FieldLabel required={required}>{label}</FieldLabel>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
        </Field>
      )}
    />
  );
}
