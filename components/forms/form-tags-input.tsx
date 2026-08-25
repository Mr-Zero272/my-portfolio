'use client';

import { Badge } from '@/components/ui/badge';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { BaseInputProps } from '@/types/form';
import { PlusIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface FormTagsInputProps extends BaseInputProps {
  allowDuplicates?: boolean;
}

export function FormTagsInput({
  required,
  optional,
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
  allowDuplicates = false,
}: FormTagsInputProps) {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = useCallback(
    (currentValue: string[] = [], onChange: (val: string[]) => void) => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      if (!allowDuplicates && currentValue.includes(trimmed)) {
        setInputValue('');
        return;
      }
      onChange([...currentValue, trimmed]);
      setInputValue('');
    },
    [inputValue, allowDuplicates],
  );

  const handleRemoveTag = useCallback(
    (currentValue: string[] = [], onChange: (val: string[]) => void, tagToRemove: string) => {
      onChange(currentValue.filter((tag) => tag !== tagToRemove));
    },
    [],
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      currentValue: string[] = [],
      onChange: (val: string[]) => void,
    ) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        handleAddTag(currentValue, onChange);
      }
    },
    [handleAddTag],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const values: string[] = Array.isArray(field.value) ? field.value : [];

        return (
          <Field className={className}>
            {label && (
              <FieldLabel htmlFor={name} required={required} optional={optional}>
                {label}
              </FieldLabel>
            )}
            <InputGroup>
              <InputGroupInput
                id={name}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, values, field.onChange)}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align="inline-end">
                <div className="flex items-center">
                  {!!inputValue && (
                    <InputGroupButton type="button" onClick={() => setInputValue('')}>
                      <XIcon />
                    </InputGroupButton>
                  )}
                  <InputGroupButton
                    type="button"
                    onClick={() => handleAddTag(values, field.onChange)}
                    disabled={!inputValue.trim() || disabled}
                  >
                    <PlusIcon />
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>

            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {values.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 pr-1 pl-2"
                  >
                    <span className="text-xs">{tag}</span>
                    {!disabled && (
                      <button
                        type="button"
                        className="hover:text-destructive rounded-full p-0.5 transition-colors"
                        onClick={() => handleRemoveTag(values, field.onChange, tag)}
                      >
                        <XIcon className="size-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}

            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
