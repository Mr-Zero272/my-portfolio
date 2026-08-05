'use client';

import { Matcher } from 'react-day-picker';
import { Controller, useFormContext } from 'react-hook-form';

import { DateTimePicker24h } from '@/components/shared/date-time-picker-24h';
import { BaseInputProps } from '@/types/form';

import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

interface FormDateTimePickerProps extends BaseInputProps {
  disabledDate?: Matcher | Matcher[];
  displayFormat?: string;
  className?: string;
}

export function FormDateTimePicker({
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  disabledDate,
  displayFormat,
  className,
}: FormDateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel required={required}>{label}</FieldLabel>}
          <DateTimePicker24h
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            disabled={disabled}
            disabledDate={disabledDate}
            displayFormat={displayFormat}
            className={className}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
