'use client';

import { Badge } from '@/components/ui/badge';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { PlusIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { ProfileFormValues } from '../../schemas';

export const RotatingWordsInput = () => {
  const { control } = useFormContext<ProfileFormValues>();
  const [word, setWord] = useState('');

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      field: ControllerRenderProps<ProfileFormValues, 'rotatingWords'>,
    ) => {
      if ((e.key === 'Comma' || e.key === 'Enter') && word.trim()) {
        e.preventDefault();
        field.onChange([...(field.value ?? []), word.trim()]);
        setWord('');
      }
    },
    [word],
  );

  return (
    <Controller
      name="rotatingWords"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor="rotatingWords">Rotate words</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="rotatingWords"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, field)}
            />
            <InputGroupAddon align="inline-end">
              <div className="flex items-center">
                {!!word && (
                  <InputGroupButton type="button" onClick={() => setWord('')}>
                    <XIcon />
                  </InputGroupButton>
                )}
                <InputGroupButton
                  type="button"
                  onClick={() => field.onChange([...(field.value ?? []), word])}
                >
                  <PlusIcon />
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
          <div className="flex flex-wrap gap-2">
            {(field.value ?? []).map((w) => (
              <Badge key={w} variant="secondary" className="flex items-center gap-1 py-1 pr-1 pl-2">
                <span className="text-xs">{w}</span>
                <button
                  className="hover:text-destructive rounded-full p-0.5 transition-colors"
                  type="button"
                  onClick={() => field.onChange(field.value?.filter((word) => word !== w))}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <FieldDescription>
            The text will rotate in the hero section. Add a few words or a short phrase to be
            displayed as rotating text.
          </FieldDescription>
          {fieldState.error && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
