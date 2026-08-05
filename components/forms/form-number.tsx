'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { BaseInputProps } from '@/types/form';

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormNumberProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number;
}

export function FormNumber({
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  min,
  max,
  step,
}: FormNumberProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && (
            <FieldLabel htmlFor={name} required={required}>
              {label}
            </FieldLabel>
          )}
          <Input
            {...field}
            id={name}
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            value={field.value ?? ''}
            min={min}
            max={max}
            step={step}
            aria-invalid={fieldState.invalid}
            onChange={(event) => {
              const { value, valueAsNumber } = event.target;
              field.onChange(
                value === '' || Number.isNaN(valueAsNumber) ? undefined : valueAsNumber,
              );
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
