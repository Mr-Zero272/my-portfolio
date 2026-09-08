import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { Spinner } from '@/components/ui/spinner';
import { EyeClosedIcon, EyeIcon, TriangleAlertIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useSignIn } from '../hooks';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
};

const ReAuthenticateDialog = ({ open, onOpenChange, email }: Props) => {
  const { form, showPassword, setShowPassword, handleSubmit, handleForgotPassword } = useSignIn({
    defaultValues: {
      email,
      password: '',
    },
    onSuccess: () => onOpenChange(false),
  });

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Re-authenticate</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Enter your credentials to refresh your session.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        {form.formState.errors.root && (
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>Failed to sign in</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}
        <form
          id="re-authenticate-form"
          className="flex flex-col gap-6 p-4 sm:p-0"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-6">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    data-error={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className={buttonVariants({ size: 'sm', variant: 'link' })}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      data-error={fieldState.invalid}
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        </form>
        <ResponsiveDialogFooter>
          <Button
            form="re-authenticate-form"
            type="submit"
            className="w-full cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
                Re-authenticating...
              </>
            ) : (
              'Re-authenticate'
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

export default ReAuthenticateDialog;
