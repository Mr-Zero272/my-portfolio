'use client';

import { ReactNode, SVGProps } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BaseInputProps } from '@/types/form';

import { AnimatedIconProps } from '@/types/animated-icon';
import { LucideIcon } from 'lucide-react';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface FormSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?:
    | LucideIcon
    | React.ComponentType<SVGProps<SVGSVGElement>>
    | React.ComponentType<AnimatedIconProps>;
}

interface FormSelectProps extends BaseInputProps {
  options: FormSelectOption[];
  triggerClassName?: string;
  contentClassName?: string;
}

export function FormSelect({
  required,
  name,
  label,
  placeholder,
  description,
  disabled,
  options,
  className,
  triggerClassName,
  contentClassName,
  parseValueToNumber = false,
}: FormSelectProps & { parseValueToNumber?: boolean }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field className={className}>
          {label && (
            <FieldLabel htmlFor={name} required={required}>
              {label}
            </FieldLabel>
          )}
          <Select
            value={field.value?.toString() ?? ''}
            onValueChange={parseValueToNumber ? (v) => field.onChange(Number(v)) : field.onChange}
            disabled={disabled}
            items={options}
          >
            <SelectTrigger id={name} className={triggerClassName} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.icon && <option.icon />}
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
