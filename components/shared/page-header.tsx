import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subTitle?: string;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  contentClassName?: string;
}

export function PageHeader({
  icon,
  title,
  subTitle,
  actions,
  backHref,
  backLabel = 'Quay lại',
  className,
  contentClassName,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 pb-6', className)}>
      {backHref && (
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-1 inline-flex w-fit items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      )}

      <div className={cn('flex items-end justify-between gap-4', contentClassName)}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          {subTitle && <p className="text-muted-foreground mt-1 text-sm">{subTitle}</p>}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
