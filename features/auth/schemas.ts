import z from 'zod';

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  });

export const signInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: passwordSchema,
});
export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name must be at most 255 characters' }),
  password: passwordSchema,
});
export type SignUpFormData = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Schema for the account settings page. Email is intentionally NOT editable —
 * better-auth's `changeEmail` is not enabled. `image` accepts an empty string
 * (meaning "no avatar") or a valid absolute URL (temp until upload is wired).
 */
export const accountInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name must be at most 255 characters' }),
  image: z.union([
    z.literal(''),
    z.url({ message: 'Please enter a valid image URL' }),
  ]),
});
export type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;
