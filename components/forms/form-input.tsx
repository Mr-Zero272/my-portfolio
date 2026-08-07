'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { BaseInputProps } from '@/types/form';

import { cn } from '@/lib/utils';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormInputProps extends BaseInputProps {
  type?: React.HTMLInputTypeAttribute;
}

export function FormInput({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  disabled,
  className,
}: FormInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && (
            <FieldLabel htmlFor={name} required={required} optional={optional}>
              {label}
            </FieldLabel>
          )}
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid}
            className={cn(className)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
