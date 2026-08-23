import { Button } from '@/components/ui/button';
import { BaseUIEvent } from '@base-ui/react';
import { CheckIcon, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { Spinner } from '../ui/spinner';

export interface AsyncButtonProps extends React.ComponentProps<typeof Button> {
  action?: () => Promise<unknown>; // async handler chính, tách khỏi onClick
  successIcon?: React.ReactElement;
  errorIcon?: React.ReactElement;
  idleIcon?: React.ReactElement;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  successDuration?: number; // thời gian hiển thị check icon (ms)
  resetDelay?: number; // sau success/error bao lâu thì reset về idle
  loadingText?: string; // đổi text lúc loading (optional)
  successText?: string;
  hideTextOnLoading?: boolean; // chỉ hiện icon lúc loading (hợp icon button)
  disableOnSuccess?: boolean; // giữ disabled sau khi thành công (VD nút submit 1 lần)
}

type ActionState = 'idle' | 'loading' | 'success' | 'error';

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  (
    {
      action,
      successIcon = <CheckIcon />,
      errorIcon = <XIcon />,
      idleIcon,
      onClick,
      onSuccess,
      onError,
      successDuration = 1500,
      // resetDelay = 300,
      loadingText,
      successText,
      hideTextOnLoading = false,
      disableOnSuccess = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const [state, setState] = React.useState<ActionState>('idle');
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

    // cleanup nếu component unmount giữa chừng
    React.useEffect(
      () => () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },
      [],
    );

    const handleClick = async (e: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => {
      if (!action) {
        onClick?.(e);
        return;
      }

      setState('loading');
      try {
        const result = await action();
        setState('success');
        onSuccess?.(result);
        timeoutRef.current = setTimeout(() => {
          if (!disableOnSuccess) setState('idle');
        }, successDuration);
      } catch (err) {
        setState('error');
        onError?.(err);
        timeoutRef.current = setTimeout(() => setState('idle'), successDuration);
      }
    };

    const isBusy = state === 'loading' || (state === 'success' && disableOnSuccess);

    return (
      <Button ref={ref} onClick={handleClick} disabled={disabled || isBusy} {...props}>
        <AnimatePresence mode="wait" initial={false}>
          {state === 'loading' && (
            <motion.span
              key="loading"
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Spinner />
              {!hideTextOnLoading && (loadingText ?? children)}
            </motion.span>
          )}

          {state === 'success' && (
            <motion.span
              key="success"
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.4 }}
            >
              {successIcon}
              {successText ?? children}
            </motion.span>
          )}

          {state === 'error' && (
            <motion.span
              key="error"
              className="inline-flex items-center gap-2 [&_svg]:text-destructive"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {errorIcon}
              {children}
            </motion.span>
          )}

          {state === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className='inline-flex items-center gap-2'
            >
              {idleIcon}
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
  },
);
AsyncButton.displayName = 'AsyncButton';