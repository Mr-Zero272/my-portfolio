import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useCallback } from 'react';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  contentClassName?: string;
  start?: React.ReactNode;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  onBack?: () => void;
}

export function PageHeader({
  icon,
  title,
  description,
  actions,
  backHref,
  backLabel = 'Back',
  className,
  contentClassName,
  start,
  top,
  bottom,
  onBack,
}: PageHeaderProps) {
  const renderBackButton = useCallback(() => {
    if (onBack) {
      return (
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground mb-1 inline-flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLabel}
        </button>
      );
    }
    if (backHref) {
      return (
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-1 inline-flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      );
    }
    return null;
  }, [backHref, backLabel, onBack]);
  return (
    <div className={cn('flex flex-col gap-1 pb-6', className)}>
      {renderBackButton()}

      <div>
        <div
          className={cn(
            'flex flex-col justify-between gap-4 md:flex-row md:items-end',
            contentClassName,
          )}
        >
          <div className="min-w-0">
            {top}
            <div className="flex items-start gap-2">
              {start}
              <div>
                <div className="flex items-center gap-2">
                  {icon}
                  {typeof title === 'string' ? (
                    <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
                  ) : (
                    <div>{title}</div>
                  )}
                </div>
                {description && typeof description === 'string' ? (
                  <p className="text-muted-foreground mt-1 text-sm">{description}</p>
                ) : (
                  <div>{description}</div>
                )}
              </div>
            </div>
            {bottom}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
