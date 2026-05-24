// import { GetAllSearchParams } from '@/types';

// export const buildQueryParams = (params: GetAllSearchParams) => {
//   const query: Record<string, string> = {};

//   // base fields
//   if (params.search) query.search = params.search;
//   if (params.page !== undefined) query.page = String(params.page);
//   if (params.limit !== undefined) query.limit = String(params.limit);
//   if (params.sortBy) query.sortBy = params.sortBy;
//   if (params.sortOrder) query.sortOrder = params.sortOrder;

//   // filters
//   if (params.filters) {
//     for (const [key, value] of Object.entries(params.filters)) {
//       if (value !== undefined && value !== null && value !== '') {
//         query[key] = String(value);
//       }
//     }
//   }

//   const queryString = new URLSearchParams(query).toString();
//   return queryString ? `?${queryString}` : '';
// };
