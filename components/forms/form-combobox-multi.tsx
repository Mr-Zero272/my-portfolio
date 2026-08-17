'use client';

import { BaseInputProps } from '@/types/form';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '../ui/combobox';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface FormComboboxMultiOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: LucideIcon;
}

export interface FormComboboxMultiProps extends BaseInputProps<string[]> {
  className?: string;
  options: FormComboboxMultiOption[];
  emptyMessage?: string;
}

export function FormComboboxMulti({
  optional,
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  className,
  options,
  emptyMessage,
}: FormComboboxMultiProps) {
  const { control } = useFormContext();
  const anchor = useComboboxAnchor();

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
          <Combobox
            multiple
            autoHighlight
            items={options}
            value={field.value ?? []}
            onValueChange={(v) => field.onChange(v)}
            itemToStringValue={(item) => item.value}
            itemToStringLabel={(item) =>
              typeof item?.label === 'string' ? item.label : (item?.value ?? '')
            }
            id={name}
          >
            <ComboboxChips ref={anchor} className="w-full max-w-xs">
              <ComboboxValue>
                {(values: string[]) => (
                  <>
                    {values?.map((val: string) => {
                      const option = options.find((opt) => opt.value === val);
                      return <ComboboxChip key={val}>{option?.label ?? val}</ComboboxChip>;
                    })}
                    <ComboboxChipsInput
                      placeholder={placeholder}
                      aria-invalid={fieldState.invalid}
                      disabled={disabled}
                      className={className}
                    />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>{emptyMessage ?? 'No items found.'}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item.value} disabled={item.disabled}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
