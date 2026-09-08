import { RefreshCw, SearchXIcon, ServerCrash } from 'lucide-react';
import { AnimatePresence, motion, Transition } from 'motion/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StateWrapperProps<T> {
  data: T | null | undefined;

  // loading
  isLoading: boolean;
  fallbackLoading?: React.ReactNode;

  // error
  error: unknown;
  fallbackError?: React.ReactNode;
  errorMessage?: string;
  errorDescription?: string;

  // empty
  checkEmpty?: (data: T) => boolean;
  fallbackEmpty?: React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;

  // refetch — khi có sẽ xuất hiện nút Thử lại ở error/empty state
  refetch?: () => void;

  // misc
  className?: string;
  contentClassName?: string;
  children: (data: T) => React.ReactNode;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const transition = { duration: 0.25, ease: 'easeOut' } as Transition;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StateContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={transition}
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-16 text-center',
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

// Loading skeleton — pulse animation
function DefaultLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className="w-full space-y-3 px-4 py-4"
    >
      {[80, 60, 72, 48, 64].map((w, i) => (
        <div
          key={i}
          className="bg-muted h-4 animate-pulse rounded-md"
          style={{
            width: `${w}%`,
            animationDelay: `${i * 80}ms`,
          }}
        />
      ))}
    </motion.div>
  );
}

// Error state
function DefaultError({
  message,
  description,
  refetch,
}: {
  message?: string;
  description?: string;
  refetch?: () => void;
}) {
  return (
    <StateContainer>
      {/* icon ring */}
      <div className="bg-destructive/10 ring-destructive/20 flex size-12 items-center justify-center rounded-full ring-1">
        <ServerCrash className="text-destructive size-6" strokeWidth={1.5} />
      </div>

      <div className="space-y-1">
        <p className="text-foreground text-base font-medium">
          {message ?? 'Some thing went wrong!'}
        </p>
        <p className="text-muted-foreground max-w-xs text-sm">
          {description ?? 'Something went wrong! Please try again later.'}
        </p>
      </div>

      {refetch && (
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw />
          Retry
        </Button>
      )}
    </StateContainer>
  );
}

// Empty state
function DefaultEmpty({
  message,
  description,
  refetch,
}: {
  message?: string;
  description?: string;
  refetch?: () => void;
}) {
  return (
    <StateContainer>
      {/* icon ring */}
      <div className="bg-muted ring-border flex size-12 items-center justify-center rounded-full ring-1">
        <SearchXIcon className="text-muted-foreground size-6" strokeWidth={1.5} />
      </div>

      <div className="space-y-1">
        <p className="text-foreground text-base font-medium">{message ?? 'No data'}</p>
        <p className="text-muted-foreground max-w-xs text-sm">
          {description ?? 'There was no data to display here!'}
        </p>
      </div>

      {refetch && (
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw />
          Retry
        </Button>
      )}
    </StateContainer>
  );
}

// ─── Default empty checker ────────────────────────────────────────────────────

function defaultCheckEmpty<T>(data: T): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data !== null && typeof data === 'object') return Object.keys(data).length === 0;
  return false;
}

// ─── Main component ───────────────────────────────────────────────────────────

const StateWrapper = <T,>({
  data,
  isLoading,
  error,
  checkEmpty,
  fallbackLoading,
  fallbackError,
  fallbackEmpty,
  errorMessage,
  errorDescription,
  emptyMessage,
  emptyDescription,
  refetch,
  className,
  contentClassName,
  children,
}: StateWrapperProps<T>) => {
  // Resolve active state key for AnimatePresence keying
  const isEmpty =
    !isLoading &&
    !error &&
    (data === undefined || (checkEmpty ? checkEmpty(data as T) : defaultCheckEmpty(data as T)));

  const activeKey = isLoading ? 'loading' : error ? 'error' : isEmpty ? 'empty' : 'content';
  const errorMessageFromError = getErrorMessage(error);

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait" initial={false}>
        {/* ── Loading ── */}
        {activeKey === 'loading' && (
          <motion.div key="loading" className="flex-1" {...fadeUp} transition={transition}>
            {fallbackLoading ?? <DefaultLoading />}
          </motion.div>
        )}

        {/* ── Error ── */}
        {activeKey === 'error' && (
          <motion.div key="error" className="flex-1" {...fadeUp} transition={transition}>
            {fallbackError ?? (
              <DefaultError
                message={errorMessage ?? errorMessageFromError}
                description={errorDescription}
                refetch={refetch}
              />
            )}
          </motion.div>
        )}

        {/* ── Empty ── */}
        {activeKey === 'empty' && (
          <motion.div key="empty" className="flex-1" {...fadeUp} transition={transition}>
            {fallbackEmpty ?? (
              <DefaultEmpty
                message={emptyMessage}
                description={emptyDescription}
                refetch={refetch}
              />
            )}
          </motion.div>
        )}

        {/* ── Content ── */}
        {activeKey === 'content' && (
          <motion.div
            key="content"
            {...fadeUp}
            transition={transition}
            className={cn('', contentClassName)}
          >
            {children(data as T)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StateWrapper;

// ─── Re-export sub-components nếu cần custom hoàn toàn ───────────────────────
export { DefaultEmpty, DefaultError, DefaultLoading };
export type { StateWrapperProps };
