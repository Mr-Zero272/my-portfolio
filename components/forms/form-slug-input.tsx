'use client';

import { RotateCcw } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { useSlugSync } from '@/hooks/use-slug-sync';
import { slugify } from '@/lib/slug';
import { BaseInputProps } from '@/types/form';

import { InputHTMLAttributes } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { InputGroup, InputGroupButton, InputGroupInput } from '../ui/input-group';

interface FormSlugInputProps extends BaseInputProps {
  sourceName: string;
  isEditMode?: boolean;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
}

export function FormSlugInput({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  sourceName,
  isEditMode,
  autoComplete,
}: FormSlugInputProps) {
  const { control } = useFormContext();
  const { isManual, resetSlug } = useSlugSync({ name, sourceName, isEditMode });

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
          <InputGroup>
            <InputGroupInput
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(slugify(e.target.value, { keepTrailingHyphen: true }))
              }
              aria-invalid={fieldState.invalid}
              autoComplete={autoComplete}
            />
            {isManual && !disabled && (
              <InputGroupButton
                type="button"
                variant="ghost"
                title={`Re-sync with ${sourceName}`}
                onClick={resetSlug}
              >
                <RotateCcw />
              </InputGroupButton>
            )}
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
