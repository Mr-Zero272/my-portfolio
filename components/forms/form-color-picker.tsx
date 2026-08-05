'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { BaseInputProps } from '@/types/form';

import { cn } from '@/lib/utils';
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '../ui/color-picker';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';

const mostUseColors = [
  '#f59e0b',
  '#f97316',
  '#ea580c',
  '#dc2626',
  '#ef4444',
  '#f87171',
  '#f43f5e',
  '#c026d3',
  '#8b5cf6',
  '#4f46e5',
  '#4338ca',
  '#3b82f6',
];

// Helper để normalize, chống lỗi nếu giá trị là Color object hoặc string

interface FormInputProps extends BaseInputProps {
  type?: React.HTMLInputTypeAttribute;
}

export function FormColorPicker({
  required,
  name,
  label,
  // placeholder,
  description,
  disabled,
}: FormInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel required={required}>{label}</FieldLabel>
          <ColorPicker
            value={field.value || '#f59e0b'}
            onValueChange={field.onChange}
            defaultFormat="hex"
            disabled={disabled}
          >
            <div className="space-y-2">
              <ColorPickerTrigger render={<ColorPickerSwatch />} />
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-muted-foreground text-xs font-medium">Most used</p>
                <div className="flex flex-wrap gap-2.5">
                  {mostUseColors.map((c) => {
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Chọn màu ${c}`}
                        style={{ backgroundColor: c }}
                        className={cn(
                          'relative flex size-7 items-center justify-center rounded-full',
                          'ring-offset-background ring-1 ring-black/10 ring-offset-2',
                          'transition-all duration-150 ease-out',
                          'hover:ring-primary/60 hover:scale-110',
                        )}
                        onClick={() => field.onChange(c)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <ColorPickerContent>
              <ColorPickerArea />
              <div className="flex items-center gap-2">
                <ColorPickerEyeDropper />
                <div className="flex flex-1 flex-col gap-2">
                  <ColorPickerHueSlider />
                  <ColorPickerAlphaSlider />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ColorPickerFormatSelect />
                <ColorPickerInput />
              </div>
            </ColorPickerContent>
          </ColorPicker>
          <FieldDescription>{description}</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
