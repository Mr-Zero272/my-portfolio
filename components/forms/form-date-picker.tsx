'use client';

import { Matcher } from 'react-day-picker';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@/components/shared/date-picker';
import { BaseInputProps } from '@/types/form';

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormDatePickerProps extends BaseInputProps {
  disabledDate?: Matcher | Matcher[];
  displayFormat?: string;
  className?: string;
}

export function FormDatePicker({
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  disabledDate,
  displayFormat,
  className,
}: FormDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className}>
          {label && <FieldLabel required={required}>{label}</FieldLabel>}
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            disabledDate={disabledDate}
            displayFormat={displayFormat}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
