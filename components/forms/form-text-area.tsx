'use client';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BaseInputProps } from '@/types/form';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormTextAreaProps extends BaseInputProps {
  rows?: number;
}

export function FormTextArea({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  rows,
  className,
  'aria-invalid': ariaInvalid,
}: FormTextAreaProps) {
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
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid || ariaInvalid}
            className={cn(className)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
