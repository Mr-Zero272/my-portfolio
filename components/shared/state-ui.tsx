import { cn } from '@/lib/utils';
import { AlertCircleIcon, CheckCircle2Icon, InboxIcon, SearchXIcon } from 'lucide-react';
import React from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';

type Props = {
  variant?: 'default' | 'empty' | 'error' | 'success';
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

const variantConfig = {
  default: {
    icon: <SearchXIcon />,
    title: 'No data',
    description: 'No data found',
    mediaClassName: 'text-muted-foreground bg-muted',
    titleClassName: 'text-foreground',
    descriptionClassName: 'text-muted-foreground',
  },
  empty: {
    icon: <InboxIcon />,
    title: 'Nothing here yet',
    description: 'There is no content to display at the moment.',
    mediaClassName: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
    titleClassName: 'text-foreground',
    descriptionClassName: 'text-muted-foreground',
  },
  error: {
    icon: <AlertCircleIcon />,
    title: 'Something went wrong',
    description: 'An error occurred. Please try again.',
    mediaClassName: 'text-destructive bg-destructive/10',
    titleClassName: 'text-destructive',
    descriptionClassName: 'text-muted-foreground',
  },
  success: {
    icon: <CheckCircle2Icon />,
    title: 'All done!',
    description: 'The operation completed successfully.',
    mediaClassName: 'text-green-600 bg-green-50 dark:bg-green-950/40',
    titleClassName: 'text-green-700 dark:text-green-400',
    descriptionClassName: 'text-muted-foreground',
  },
} satisfies Record<
  NonNullable<Props['variant']>,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    mediaClassName: string;
    titleClassName: string;
    descriptionClassName: string;
  }
>;

const StateUI = ({ variant = 'default', icon, title, description, actions, className }: Props) => {
  const config = variantConfig[variant];

  const resolvedIcon = icon ?? config.icon;
  const resolvedTitle = title ?? config.title;
  const resolvedDescription = description ?? config.description;

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className={cn('[&_svg]:size-6 rounded-full p-3', config.mediaClassName)}
        >
          {resolvedIcon}
        </EmptyMedia>
        <EmptyTitle className={config.titleClassName}>{resolvedTitle}</EmptyTitle>
        <EmptyDescription className={config.descriptionClassName}>
          {resolvedDescription}
        </EmptyDescription>
      </EmptyHeader>
      {actions && <EmptyContent>{actions}</EmptyContent>}
    </Empty>
  );
};

export default StateUI;
