import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      'Something went wrong'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

/**
 * @param error The error object to handle
 * @param customMessage An optional custom message to prepend to the error message
 * @param withToast Whether to show a toast notification (default: true)
 * @returns The final error message string
 */
export const handleError = ({
  error,
  customMessage,
  withToast = true,
}: {
  error: unknown;
  customMessage?: string;
  withToast?: boolean;
}): string => {
  const errorMessage = getErrorMessage(error);
  const finalMessage = customMessage ? `${customMessage}: ${errorMessage}` : errorMessage;
  if (withToast) {
    // Assuming you have a toast utility, e.g., from react-toastify
    toast.error('Error', {
      id: 'error-toast',
      description: finalMessage,
    });
  }

  return finalMessage;
};
