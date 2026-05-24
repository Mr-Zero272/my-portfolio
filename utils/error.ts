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
  return 'Something went wrong';
};

export const handleError = ({
  error,
  customMessage,
  withToast = true,
}: {
  error: unknown;
  customMessage?: string;
  withToast?: boolean;
}) => {
  const errorMessage = getErrorMessage(error);
  const finalMessage = customMessage ? `${customMessage}: ${errorMessage}` : errorMessage;
  if (withToast) {
    // Assuming you have a toast utility, e.g., from react-toastify
    toast.error(finalMessage);
  }
  console.error(finalMessage);
};
