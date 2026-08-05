'use client';

import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BaseInputProps } from '@/types/form';

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface FormRadioGroupOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

interface FormRadioGroupProps extends BaseInputProps {
  options: FormRadioGroupOption[];
  className?: string;
}

export function FormRadioGroup({
  required,
  name,
  label,
  description,
  disabled,
  options,
  className,
}: FormRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel required={required}>{label}</FieldLabel>}
          <RadioGroup
            value={field.value ?? ''}
            onValueChange={field.onChange}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className={className}
          >
            {options.map((option) => (
              <Field key={option.value} orientation="horizontal">
                <RadioGroupItem value={option.value} disabled={option.disabled} />
                <FieldContent>
                  <FieldLabel>{option.label}</FieldLabel>
                  {option.description && <FieldDescription>{option.description}</FieldDescription>}
                </FieldContent>
              </Field>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
