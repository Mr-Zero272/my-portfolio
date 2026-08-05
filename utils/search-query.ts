import { BaseQuery } from '@/types/api';

export const normalizeQueryParams = (params: BaseQuery) => {
  const query: Record<string, string> = {};

  // base fields
  if (params.search) query.search = params.search;
  query.page = params.page ? String(params.page) : '1';
  query.limit = params.limit ? String(params.limit) : '10';
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;

  // filters
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
  }

  return query;
};
