'use client';

import { BaseInputProps } from '@/types/form';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import RichTextEditor from '../ui/rich-text-editor';

// interface FormRichTextProps extends BaseInputProps {}

export function FormRichText({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
  'aria-invalid': ariaInvalid,
}: BaseInputProps) {
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
          <RichTextEditor
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(jsonString) => {
              field.onChange(jsonString);
            }}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid || ariaInvalid}
            className={className}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
