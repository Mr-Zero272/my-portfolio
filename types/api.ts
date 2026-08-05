export interface PaginationResponseMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ApiResponseMeta {
  pagination?: PaginationResponseMeta;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  httpStatusCode?: number;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ListResponse<T> {
  list: T[];
  pagination?: PaginationResponseMeta;
  meta?: ApiResponseMeta;
}

export type SortOrder = 'asc' | 'desc';

/**
 * @param TFilter - Type of filters object. If not provided, it defaults to a generic Record type.
 */
export type BaseQuery<TFilter = void> = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: TFilter extends void ? Record<string, string | number | boolean | undefined> : TFilter;
};

type RequiredState = {
  path: 'required' | 'optional';
  query: 'required' | 'optional';
  body: 'required' | 'optional';
};
type DefaultState = { path: 'optional'; query: 'optional'; body: 'optional' };

type MaybeRequired<K extends string, T, S extends 'required' | 'optional'> = S extends 'required'
  ? { [P in K]: T }
  : { [P in K]?: T };

export type RequestConfig<
  TPath = undefined,
  TQuery = undefined,
  TBody = undefined,
  TState extends RequiredState = DefaultState,
> = MaybeRequired<'path', TPath, TState['path']> &
  MaybeRequired<'query', TQuery, TState['query']> &
  MaybeRequired<'body', TBody, TState['body']>;
