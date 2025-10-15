'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  variant?: 'default' | 'destructive';
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  isHandling?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function ConfirmDialog({
  variant = 'destructive',
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone. This will permanently delete your account and remove all of your data from our servers. You will not be able to recover your account.',
  confirmText = 'Delete Account',
  cancelText = 'Cancel',
  isHandling = false,
  open,
  trigger,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCancel?.()}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm?.()}
            className={cn('', {
              'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600': variant === 'destructive',
              'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary': variant === 'default',
            })}
            disabled={isHandling}
          >
            {isHandling && <Loader2 className="size-4" />}
            {isHandling ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
