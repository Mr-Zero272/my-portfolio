'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { BaseInputProps } from '@/types/form';

import { MultiSelect, type MultiSelectProps } from '../ui/multi-select';

export interface FormMultiSelectProps<T extends { id: string }>
  extends BaseInputProps, Omit<MultiSelectProps<T>, 'value' | 'onValueChange' | 'className'> {
  className?: string;
}

export function FormMultiSelect<T extends { id: string }>({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  className,

  // MultiSelect props
  searchResults,
  selectedItems,
  isLoading,
  onSearch,
  onCreate,
  createLabel,
  renderItem,
  renderBadge,
  getItemId,
  itemToString,
}: FormMultiSelectProps<T>) {
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
          <MultiSelect
            value={field.value ?? []}
            onValueChange={field.onChange}
            searchResults={searchResults}
            selectedItems={selectedItems}
            isLoading={isLoading}
            onSearch={onSearch}
            onCreate={onCreate}
            createLabel={createLabel}
            renderItem={renderItem}
            renderBadge={renderBadge}
            getItemId={getItemId}
            itemToString={itemToString}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
