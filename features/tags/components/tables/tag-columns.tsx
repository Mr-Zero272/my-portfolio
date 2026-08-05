import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ActionItem, ResponsiveActions } from '@/components/shared/responsive-actions';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/format';
import { Tag } from '@/lib/generated/prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { TentIcon } from 'lucide-react';
import { useMemo } from 'react';

type UseTagColumnsProps = {
  onRowClick?: (tag: Tag) => void;
  actions?: ActionItem<Tag>[];
};

export const useTagColumns = ({ onRowClick, actions }: UseTagColumnsProps) => {
  return useMemo(
    (): ColumnDef<Tag>[] => [
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
        cell: ({ row }) => (
          <Button
            variant="link"
            className="p-0 font-medium"
            onClick={() => onRowClick?.(row.original)}
          >
            {row.original.name}
          </Button>
        ),
        meta: {
          label: 'Name',
          placeholder: 'Search tag...',
          variant: 'text',
          icon: TentIcon,
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: 'slug',
        accessorKey: 'slug',
        header: ({ column }) => <DataTableColumnHeader column={column} label="Slug" />,
        cell: ({ row }) => <div>{row.getValue('slug')}</div>,
        meta: {
          label: 'Slug',
        },
        enableColumnFilter: true,
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
          return <ResponsiveActions<Tag> actions={actions ?? []} context={row.original} />;
        },
        enableSorting: false,
        size: 32,
      },
    ],
    [actions],
  );
};
