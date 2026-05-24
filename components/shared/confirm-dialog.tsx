'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  cancelLabel?: string;
  confirmLabel?: string;
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
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    onConfirm,
  } = props;

  const requireText = 'requireText' in props ? props.requireText : undefined;
  const requireTextLabel = 'requireTextLabel' in props ? props.requireTextLabel : undefined;

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const isTextMatched = !requireText || inputValue === requireText;

  async function handleConfirm() {
    if (!isTextMatched) return;
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setInputValue('');
      onOpenChange(false);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) setInputValue('');
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {icon && (
            <div
              className={cn(
                'mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg',
                iconBadgeClass[variant],
              )}
            >
              {icon}
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm">{description}</div>
          </DialogDescription>
        </DialogHeader>

        {requireText && (
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-sm">
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

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant[variant]}
            onClick={handleConfirm}
            disabled={!isTextMatched || loading}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
