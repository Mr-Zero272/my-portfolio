import { cn } from '@/lib/utils';

type Props = {
  message?: string;
  className?: string;
};

const ErrorMessage = ({ message, className = '' }: Props) => {
  if (!message) return null;
  return <p className={cn('text-destructive text-sm', className)}>{message}</p>;
};

export default ErrorMessage;
