import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionItem, ResponsiveActions } from '@/components/shared/responsive-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import { Post } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { AlarmClockIcon, TentIcon } from 'lucide-react';
import { useMemo } from 'react';
import { getPostStatusConfig } from '../../constants';

type UsePostColumnsProps = {
  onRowClick?: (post: Post) => void;
  actions?: ActionItem<Post>[];
};

export const usePostColumns = ({ onRowClick, actions }: UsePostColumnsProps) => {
  return useMemo(
    (): ColumnDef<Post>[] => [
      {
        id: 'title',
        accessorKey: 'title',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
        cell: ({ row }) => (
          <Button
            variant="link"
            className="p-0 font-medium"
            onClick={() => onRowClick?.(row.original)}
          >
            {row.original.title}
          </Button>
        ),
        meta: {
          label: 'Title',
          placeholder: 'Search post...',
          variant: 'text',
          icon: TentIcon,
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Published" />,
        cell: ({ row }) => {
          const value = row.getValue('status');
          const config = getPostStatusConfig(value as string);
          const Icon = config?.icon ?? AlarmClockIcon;
          return (
            <Badge variant={value === 'Published' ? 'default' : 'outline'} className="capitalize">
              <Icon />
              {config?.label as string ?? value ?? '--'}
            </Badge>
          );
        },
        meta: {
          label: 'Published',
        },
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'views',
        accessorKey: 'views',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Views" />,
        cell: ({ row }) => <div>{row.getValue('views')}</div>,
        meta: {
          label: 'Views',
        },
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
        cell: ({ row }) => <div>{formatDateTime(row.getValue('createdAt'))}</div>,
        meta: {
          label: 'Created At',
        },
        enableSorting: true,
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Updated At" />,
        cell: ({ row }) => {
          const value = row.getValue('updatedAt') as string | undefined | null;
          return <div>{value ? formatDateTime(value) : '--'}</div>;
        },
        meta: {
          label: 'Updated At',
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return <ResponsiveActions<Post> actions={actions ?? []} context={row.original} />;
        },
        enableSorting: false,
        size: 32,
      },
    ],
    [actions, onRowClick],
  );
};
