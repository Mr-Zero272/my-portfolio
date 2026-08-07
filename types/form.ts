// types/form.ts

export type FormErrors<T> = {
  [K in keyof T]?: string;
} & {
  root?: string;
};

import { FieldValues } from 'react-hook-form';

/**
 * Base props for form across the app.
 *
 * @template TValues Type of form values (react-hook-form FieldValues).
 * @template TContext Context passed to the form.
 * pass void if no context is needed.
 *
 * @example
 * type Props = BaseFormProps<UserFormValues>;
 *
 * @example
 * type Props = BaseFormProps<UserFormValues, {
 *   mode: 'create' | 'edit';
 * }>;
 */
export type BaseFormProps<TValues extends FieldValues, TContext = void> = {
  /** Initial data to pre-fill the form. */
  initialData?: Partial<TValues>;

  /** Callback when form is cancelled. */
  onCancel?: () => void;

  /** Loading indicator. */
  isSubmitting?: boolean;

  /** Server errors */
  serverErrors?: Partial<Record<keyof TValues | 'root', string>>;

  /** Form id, use for submit out of the form */
  formId?: string;

  /** render function support render submit part out of the form */
  renderSubmitPart?: (props: { isSubmitting: boolean; formId: string }) => React.ReactNode;

  /** Submit button label.. */
  submitButtonLabel?: string;

  /** Icon of submit button */
  submitButtonIcon?: React.ReactNode;

  /** Hide submit part when use renderSubmitPart */
  hideSubmitPart?: boolean;

  /** ClassName of the form container. */
  className?: string;

  /** if true, form will be in edit mode */
  isEditMode?: boolean;
} & (TContext extends void
  ? {
      /** Submit function when no context is needed. */
      onSubmit: (values: TValues) => Promise<void> | void;
      context?: never;
    }
  : {
      /** Context passed to the form. */
      context: TContext;

      /** Submit function when context is needed. */
      onSubmit: (values: TValues) => Promise<void> | void;
    });

/** Base props for input across the app.
 * @template TValue Type of the input value.
 * @example
 * type Props = BaseInputProps<string>;
 */
export interface BaseInputProps<TValue = void> {
  optional?: boolean;
  required?: boolean;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  value?: TValue;
  onChange?: (value: TValue) => void;
  className?: string;

  //
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling' | undefined;
}
