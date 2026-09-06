import { getSortingStateParser } from '@/lib/parsers';
import { SortOrder } from '@/types/api';
import { Tag } from '@prisma/client';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useMemo } from 'react';
import { GetTagsRequest } from '../types';

export const useTagTableParams = () => {
  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<Tag>().withDefault([]),
    name: parseAsString.withDefault(''),
  });

  return useMemo(
    () =>
      ({
        query: {
          page: params.page,
          limit: params.perPage,
          sortBy: params.sort?.[0]?.id ?? 'createdAt',
          sortOrder: (params.sort?.[0]?.desc ? 'desc' : 'asc') as SortOrder,
          search: params.name,
        },
      }) satisfies GetTagsRequest,
    [params],
  );
};
