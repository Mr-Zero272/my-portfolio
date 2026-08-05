'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BaseInputProps } from '@/types/form';
import { LucideIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

export interface FormBadgeOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  /** Màu badge khi được chọn (active), ví dụ: 'destructive' cho priority cao, 'default' cho medium... */
  activeClassName?: string;
}

interface FormBadgeGroupProps extends BaseInputProps {
  options: FormBadgeOption[];
  className?: string;
  badgeClassName?: string;
  /** Cho phép bỏ chọn khi click lại vào badge đang active (giá trị về undefined) */
  allowDeselect?: boolean;
}

export function FormBadgeGroup({
  required,
  name,
  label,
  description,
  disabled,
  options,
  className,
  badgeClassName,
  allowDeselect = false,
}: FormBadgeGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel required={required}>{label}</FieldLabel>}
          <div className={cn('inline-flex w-full flex-wrap gap-2', className)}>
            {options.map((option) => {
              const isActive = field.value === option.value;
              const isDisabled = disabled || option.disabled;

              return (
                <Badge
                  key={option.value}
                  variant={isActive ? 'default' : 'outline'}
                  aria-invalid={fieldState.invalid}
                  aria-pressed={isActive}
                  className={cn(
                    'cursor-pointer gap-1 px-1.5 py-1 transition-colors select-none',
                    isDisabled && 'pointer-events-none opacity-50',
                    isActive && option.activeClassName,
                    badgeClassName,
                  )}
                  onClick={() => {
                    if (isDisabled) return;
                    if (isActive && allowDeselect) {
                      field.onChange(undefined);
                      return;
                    }
                    field.onChange(option.value);
                  }}
                >
                  {option.icon && <option.icon className="size-3" />}
                  {option.label}
                </Badge>
              );
            })}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
      )}
    />
  );
}
