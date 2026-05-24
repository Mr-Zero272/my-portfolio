import { ApiResponse, ListResponse } from '@/types';

export const convertToListResponse = <T>(
  response: unknown,
  mapper: (data: unknown[]) => T[],
): ListResponse<T> => {
  const list = mapper((response as ApiResponse<T[]>).data);
  const metaFromRes = (response as ApiResponse<T[]>).meta;
  const meta = metaFromRes || {
    page: 1,
    limit: list.length,
    total: list.length,
    totalPages: 1,
  };

  return { list, meta };
};
