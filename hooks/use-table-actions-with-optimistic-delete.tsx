import { ActionItem } from '@/components/shared/responsive-actions';
import { DataTableBaseProps } from '@/types/data-table';
import type { QueryKey } from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';

type UseTableActionsWithOptimisticDeleteOptions<T> = {
  actions?: ActionItem<T>[];
  onOptimisticDelete?: DataTableBaseProps<T>['onOptimisticDelete'];
  queryKey: QueryKey;
};

export function useTableActionsWithOptimisticDelete<T>({
  actions,
  onOptimisticDelete,
  queryKey,
}: UseTableActionsWithOptimisticDeleteOptions<T>): ActionItem<T>[] {
  return useMemo(() => {
    if (!actions || actions.length === 0) return [];
    if (!onOptimisticDelete) return actions;

    return [
      ...actions,
      {
        key: 'optimistic-delete',
        label: 'Delete',
        icon: <Trash2Icon />,
        onClick: (row: T) => onOptimisticDelete({ data: row, queryKey }),
        tooltip: 'Delete',
        variant: 'destructive',
      },
    ];
  }, [actions, onOptimisticDelete, queryKey]) as ActionItem<T>[];
}
