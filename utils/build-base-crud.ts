// import axiosInstance from '@/lib/axios';
// import { BaseQueryParams, ListResponse } from '@/types';
// import { buildQueryParams } from './build-query';
// import { convertToListResponse } from './convert-response';

// export const createCrudApi = <TEntity, TCreate, TUpdate, TParams = void>({
//   baseUrl,
//   convertToEntity,
//   convertToEntityList,
//   config,
// }: {
//   baseUrl: string | ((params: TParams) => string);
//   convertToEntity: (data: unknown) => TEntity;
//   convertToEntityList: (data: unknown) => TEntity[];
//   config?: {
//     params: TParams;
//   };
// }) => {
//   const buildUrl = (params?: TParams): string => {
//     if (typeof baseUrl === 'function') {
//       if (params === undefined) throw new Error('Params required');
//       return baseUrl(params);
//     }
//     return baseUrl;
//   };

//   const buildMethods = (resolvedUrl: string) => ({
//     getAll: async (queryParams?: Partial<BaseQueryParams>) => {
//       const qs = queryParams?.searchParams ? buildQueryParams(queryParams?.searchParams) : '';
//       const res = await axiosInstance.get(`${resolvedUrl}${qs}`);
//       return convertToListResponse<TEntity>(res.data, convertToEntityList);
//     },
//     getById: async (id: string) => {
//       const res = await axiosInstance.get(`${resolvedUrl}/${id}`);
//       return convertToEntity(res.data.data);
//     },
//     create: async (data: TCreate) => {
//       const res = await axiosInstance.post(resolvedUrl, data);
//       return convertToEntity(res.data.data);
//     },
//     update: async (id: string, data: TUpdate) => {
//       const res = await axiosInstance.patch(`${resolvedUrl}/${id}`, data);
//       return convertToEntity(res.data.data);
//     },
//     delete: async (id: string) => {
//       const res = await axiosInstance.delete(`${resolvedUrl}/${id}`);
//       return res.data.success;
//     },
//   });

//   return {
//     ...(typeof baseUrl === 'string' || config?.params !== undefined
//       ? buildMethods(buildUrl(config?.params))
//       : ({} as ReturnType<typeof buildMethods>)),
//     withParams: (params: TParams) => buildMethods(buildUrl(params)),
//   };
// };

// export const createMutationKeys = (baseKey: string) => ({
//   all: [baseKey],
//   create: () => [...createMutationKeys(baseKey).all, 'create'] as const,
//   update: () => [...createMutationKeys(baseKey).all, 'update'] as const,
//   delete: () => [...createMutationKeys(baseKey).all, 'delete'] as const,
// });

// export const createMutations = <TEntity, TCreate, TUpdate>(
//   mutationKeys: ReturnType<typeof createMutationKeys>,
//   apiFunctions: ReturnType<typeof createCrudApi<TEntity, TCreate, TUpdate>>,
// ) => ({
//   create: () => ({
//     mutationKey: mutationKeys.create(),
//     mutationFn: (data: TCreate) => apiFunctions.create(data),
//   }),
//   update: () => ({
//     mutationKey: mutationKeys.update(),
//     mutationFn: (id: string, data: TUpdate) => apiFunctions.update(id, data),
//   }),
//   delete: () => ({
//     mutationKey: mutationKeys.delete(),
//     mutationFn: (id: string) => apiFunctions.delete(id),
//   }),
// });

// export const createQueryKeys = (baseKey: string) => ({
//   all: [baseKey],
//   getAll: (queryParams?: Partial<BaseQueryParams>) =>
//     [...createQueryKeys(baseKey).all, 'getAll', queryParams] as const,
//   getById: (id: string) => [...createQueryKeys(baseKey).all, 'getById', id] as const,
// });

// export const createQueries = <TEntity, TCreate, TUpdate>(
//   queryKeys: ReturnType<typeof createQueryKeys>,
//   apiFunctions: ReturnType<typeof createCrudApi<TEntity, TCreate, TUpdate>>,
// ) => ({
//   getAll: (queryParams?: Partial<BaseQueryParams>) => ({
//     queryKey: queryKeys.getAll(queryParams),
//     queryFn: () => apiFunctions.getAll(queryParams),
//   }),
//   getById: (id: string) => ({
//     queryKey: queryKeys.getById(id),
//     queryFn: () => apiFunctions.getById(id),
//   }),
// });

// // --- Dynamic (parameterized baseUrl) variants ---

// export const createDynamicQueryKeys = <TParams>(baseKey: string) => ({
//   all: [baseKey] as const,
//   parameterized: (params: TParams) => [baseKey, params] as const,
//   getAll: (params: TParams, queryParams?: Partial<BaseQueryParams>) =>
//     [baseKey, params, 'getAll', queryParams] as const,
//   getById: (params: TParams, id: string) => [baseKey, params, 'getById', id] as const,
// });

// export const createDynamicQueries = <TEntity, TParams>(
//   queryKeys: {
//     getAll: (params: TParams, queryParams?: Partial<BaseQueryParams>) => readonly unknown[];
//     getById: (params: TParams, id: string) => readonly unknown[];
//   },
//   apiFunctions: {
//     withParams: (params: TParams) => {
//       getAll: (queryParams?: Partial<BaseQueryParams>) => Promise<ListResponse<TEntity>>;
//       getById: (id: string) => Promise<TEntity>;
//     };
//   },
// ) => ({
//   getAll: (params: TParams, queryParams?: Partial<BaseQueryParams>) => ({
//     queryKey: queryKeys.getAll(params, queryParams),
//     queryFn: () => apiFunctions.withParams(params).getAll(queryParams),
//   }),
//   getById: (params: TParams, id: string) => ({
//     queryKey: queryKeys.getById(params, id),
//     queryFn: () => apiFunctions.withParams(params).getById(id),
//   }),
// });

// export const createDynamicMutations = <TEntity, TCreate, TUpdate, TParams>(
//   mutationKeys: ReturnType<typeof createMutationKeys>,
//   apiFunctions: {
//     withParams: (params: TParams) => {
//       create: (data: TCreate) => Promise<TEntity>;
//       update: (id: string, data: TUpdate) => Promise<TEntity>;
//       delete: (id: string) => Promise<boolean>;
//     };
//   },
// ) => ({
//   create: (params: TParams) => ({
//     mutationKey: mutationKeys.create(),
//     mutationFn: (data: TCreate) => apiFunctions.withParams(params).create(data),
//   }),
//   update: (params: TParams) => ({
//     mutationKey: mutationKeys.update(),
//     mutationFn: ({ id, data }: { id: string; data: TUpdate }) =>
//       apiFunctions.withParams(params).update(id, data),
//   }),
//   delete: (params: TParams) => ({
//     mutationKey: mutationKeys.delete(),
//     mutationFn: (id: string) => apiFunctions.withParams(params).delete(id),
//   }),
// });
