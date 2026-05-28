import axiosInstance from '@/lib/axios';
import type { ApiMeta, ApiSuccessResponse, PaginationMeta } from './response';

export type CrudId = string | number;

export type CrudListParams = {
  filters?: Record<string, unknown>;
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type CrudListResult<TEntity, TMeta extends ApiMeta = ApiMeta> = {
  items: TEntity[];
  meta?: TMeta;
  pagination?: PaginationMeta;
};

export type BuildBaseCrudServiceOptions<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TListParams extends CrudListParams = CrudListParams,
> = {
  basePath: string;
  createPath?: string | ((input: TCreateInput) => string);
  dataKey?: string;
  deletePath?: string | ((id: CrudId) => string);
  getAllPath?: string | ((params?: TListParams) => string);
  getByIdPath?: string | ((id: CrudId) => string);
  selectEntity?: (data: unknown) => TEntity;
  selectList?: (data: unknown) => TEntity[];
  updatePath?: string | ((id: CrudId, input: TUpdateInput) => string);
};

export type BaseCrudService<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TListParams extends CrudListParams = CrudListParams,
  TMeta extends ApiMeta = ApiMeta,
> = {
  create: (input: TCreateInput) => Promise<TEntity>;
  delete: (id: CrudId) => Promise<CrudId>;
  getAll: (params?: TListParams) => Promise<CrudListResult<TEntity, TMeta>>;
  getById: (id: CrudId) => Promise<TEntity>;
  update: (id: CrudId, input: TUpdateInput) => Promise<TEntity>;
};

export function buildBaseCrudService<
  TEntity,
  TCreateInput = Partial<TEntity>,
  TUpdateInput = Partial<TEntity>,
  TListParams extends CrudListParams = CrudListParams,
  TMeta extends ApiMeta = ApiMeta,
>(
  options: BuildBaseCrudServiceOptions<TEntity, TCreateInput, TUpdateInput, TListParams>,
): BaseCrudService<TEntity, TCreateInput, TUpdateInput, TListParams, TMeta> {
  const basePath = normalizePath(options.basePath);
  const selectEntity =
    options.selectEntity ?? ((data: unknown) => selectByKey<TEntity>(data, options.dataKey));
  const selectList = options.selectList ?? ((data: unknown) => data as TEntity[]);

  return {
    create: async (input) => {
      const response = await axiosInstance.post<ApiSuccessResponse<unknown>>(
        resolvePath(options.createPath, basePath, input),
        input,
      );

      return selectEntity(response.data.data);
    },
    delete: async (id) => {
      const response = await axiosInstance.delete<ApiSuccessResponse<{ id: CrudId } | CrudId>>(
        resolvePath(options.deletePath, `${basePath}/${id}`, id),
      );

      return normalizeDeletedId(response.data.data, id);
    },
    getAll: async (params) => {
      const path = resolvePath(options.getAllPath, basePath, params);
      const response = await axiosInstance.get<ApiSuccessResponse<unknown, TMeta>>(
        appendSearchParams(path, params),
      );
      const meta = response.data.meta as (TMeta & { pagination?: PaginationMeta }) | undefined;

      return {
        items: selectList(response.data.data),
        meta,
        pagination: meta?.pagination,
      };
    },
    getById: async (id) => {
      const response = await axiosInstance.get<ApiSuccessResponse<unknown>>(
        resolvePath(options.getByIdPath, `${basePath}/${id}`, id),
      );

      return selectEntity(response.data.data);
    },
    update: async (id, input) => {
      const response = await axiosInstance.patch<ApiSuccessResponse<unknown>>(
        resolvePath(options.updatePath, `${basePath}/${id}`, id, input),
        input,
      );

      return selectEntity(response.data.data);
    },
  };
}

export function buildCrudQueryKeys<TKey extends string>(key: TKey) {
  const all = [key] as const;
  const lists = [...all, 'list'] as const;
  const details = [...all, 'detail'] as const;
  const mutations = [...all, 'mutation'] as const;

  return {
    all,
    create: () => [...mutations, 'create'] as const,
    delete: (id?: CrudId) => [...mutations, 'delete', id] as const,
    detail: (id: CrudId) => [...details, id] as const,
    details,
    list: <TListParams extends CrudListParams>(params?: TListParams) =>
      [...lists, params ?? {}] as const,
    lists,
    update: (id?: CrudId) => [...mutations, 'update', id] as const,
  };
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function resolvePath<TArg>(
  path: string | ((arg: TArg) => string) | undefined,
  fallback: string,
  arg: TArg,
): string;
function resolvePath<TFirstArg, TSecondArg>(
  path: string | ((firstArg: TFirstArg, secondArg: TSecondArg) => string) | undefined,
  fallback: string,
  firstArg: TFirstArg,
  secondArg: TSecondArg,
): string;
function resolvePath(
  path: string | ((...args: unknown[]) => string) | undefined,
  fallback: string,
  ...args: unknown[]
) {
  if (!path) return fallback;
  if (typeof path === 'string') return normalizePath(path);

  return normalizePath(path(...args));
}

function appendSearchParams(path: string, params?: CrudListParams) {
  if (!params) return path;

  const searchParams = new URLSearchParams();
  const { filters, ...baseParams } = params;

  appendParams(searchParams, baseParams);
  appendParams(searchParams, filters);

  const query = searchParams.toString();

  if (!query) return path;

  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}

function appendParams(searchParams: URLSearchParams, params?: Record<string, unknown>) {
  if (!params) return;

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'undefined' || value === null || value === '') continue;

    if (Array.isArray(value)) {
      searchParams.set(key, value.join(','));
      continue;
    }

    searchParams.set(key, String(value));
  }
}

function normalizeDeletedId(data: { id: CrudId } | CrudId, fallbackId: CrudId) {
  if (typeof data === 'object' && data !== null && 'id' in data) {
    return data.id;
  }

  return data ?? fallbackId;
}

function selectByKey<TEntity>(data: unknown, key?: string) {
  if (!key) return data as TEntity;

  if (typeof data === 'object' && data !== null && key in data) {
    return (data as Record<string, TEntity>)[key];
  }

  return data as TEntity;
}
