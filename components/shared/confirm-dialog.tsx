'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from '../ui/alert-dialog';
import { Spinner } from '../ui/spinner';

// ─── Types ──────────────────────────────────────────────────────────────────

type Variant = 'default' | 'destructive' | 'warning';

interface ConfirmDialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Icon rendered inside the icon badge — can be a string emoji, or a React node */
  icon?: React.ReactNode;
  /** Controls the color of the icon badge */
  variant?: Variant;
  title: string;
  description: React.ReactNode;
  cancelIcon?: React.ReactNode;
  cancelLabel?: string;
  confirmIcon?: React.ReactNode;
  confirmLabel?: string;

  size?: 'default' | 'sm';
  isLoading?: boolean;
  /** Called when user confirms. Can be async — button will show loading state */
  onConfirm: () => void | Promise<void>;
}

interface ConfirmDialogWithTextProps extends ConfirmDialogBaseProps {
  /** If set, user must type this exact string before confirming */
  requireText: string;
  requireTextLabel?: string;
}

type ConfirmDialogProps = ConfirmDialogBaseProps | ConfirmDialogWithTextProps;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const iconBadgeClass: Record<Variant, string> = {
  default: 'bg-muted text-muted-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
};

const confirmButtonVariant: Record<Variant, 'default' | 'destructive' | 'outline'> = {
  default: 'default',
  destructive: 'destructive',
  warning: 'default',
};

// ─── Component ───────────────────────────────────────────────────────────────

function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    open,
    onOpenChange,
    icon,
    variant = 'default',
    title,
    description,
    cancelIcon,
    cancelLabel = 'Cancel',
    confirmIcon,
    confirmLabel = 'Confirm',
    size = 'default',
    isLoading,
    onConfirm,
  } = props;

  const requireText = 'requireText' in props ? props.requireText : undefined;
  const requireTextLabel = 'requireTextLabel' in props ? props.requireTextLabel : undefined;

  const [inputValue, setInputValue] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const loading = isLoading || localLoading;

  const isTextMatched = !requireText || inputValue === requireText;

  async function handleConfirm() {
    if (!isTextMatched) return;
    try {
      setLocalLoading(true);
      await onConfirm();
    } finally {
      setLocalLoading(false);
      setInputValue('');
      onOpenChange(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) setInputValue('');
    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          {icon && (
            <AlertDialogMedia
            // className={cn(
            //   '',
            //   iconBadgeClass[variant],
            // )}
            >
              {icon}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireText && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="require-text" className="text-muted-foreground text-sm">
              {requireTextLabel ?? (
                <>
                  Type{' '}
                  <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                    {requireText}
                  </code>{' '}
                  to confirm
                </>
              )}
            </Label>
            <Input
              id='require-text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={requireText}
              className={cn(
                'font-mono text-sm',
                inputValue.length > 0 &&
                (isTextMatched
                  ? 'border-emerald-500 focus-visible:ring-emerald-500/20'
                  : 'border-destructive focus-visible:ring-destructive/20'),
              )}
              autoComplete="off"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isTextMatched) handleConfirm();
              }}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={loading}>
            {cancelIcon}
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={confirmButtonVariant[variant]}
            onClick={handleConfirm}
            disabled={!isTextMatched || loading}
          >
            {confirmIcon && loading ? <Spinner /> : confirmIcon}
            {loading ? 'Please wait...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
