'use client';

import { Switch } from '@/components/ui/switch';
import { BaseInputProps } from '@/types/form';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormSwitchProps extends BaseInputProps {
  size?: 'sm' | 'default';
}

export function FormSwitch({
  required,
  name,
  label,
  description,
  disabled,
  size,
}: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal">
          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            disabled={disabled}
            size={size}
            aria-invalid={fieldState.invalid}
            id={name}
          />
          <FieldContent>
            {label && (
              <FieldLabel htmlFor={name} required={required}>
                {label}
              </FieldLabel>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
        </Field>
      )}
    />
  );
}
