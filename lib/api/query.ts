export enum ListQueryParam {
  LIMIT = 'limit',
  PAGE = 'page',
  SEARCH = 'search',
  SORT_BY = 'sortBy',
  SORT_ORDER = 'sortOrder',
}

export enum FilterOperator {
  CONTAINS = 'contains',
  ENDS_WITH = 'endsWith',
  EQUALS = 'equals',
  GT = 'gt',
  GTE = 'gte',
  HAS = 'has',
  HAS_EVERY = 'hasEvery',
  HAS_SOME = 'hasSome',
  IN = 'in',
  LT = 'lt',
  LTE = 'lte',
  STARTS_WITH = 'startsWith',
}

export type SortOrder = 'asc' | 'desc';
export type QueryWhere = Record<string, unknown>;

export type ListPagination = {
  limit: number;
  page: number;
  skip: number;
  take: number;
};

export type ListQueryResult<TWhere extends QueryWhere = QueryWhere> = {
  filters: Record<string, unknown>;
  orderBy: Record<string, SortOrder>;
  pagination: ListPagination;
  search: string | null;
  where: TWhere;
};

export type FilterFieldConfig = {
  field?: string;
  operator?: FilterOperator;
  param?: string;
  parse?: (value: string) => unknown;
};

export type BuildListQueryOptions<TWhere extends QueryWhere = QueryWhere> = {
  baseWhere?: TWhere;
  defaultLimit?: number;
  defaultSort?: Record<string, SortOrder>;
  filterFields?: Record<string, FilterFieldConfig>;
  maxLimit?: number;
  searchFields?: readonly string[];
  sortableFields?: readonly string[];
};

const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_LIMIT = 100;
const DEFAULT_SORT = { createdAt: 'desc' } as const;

export function parseBooleanParam(value: string) {
  if (value === 'true') return true;
  if (value === 'false') return false;

  return value;
}

export function parseNumberParam(value: string) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : value;
}

export function parseEnumParam<T extends string>(enumValues: T[]) {
  return (value: string) => {
    if (!enumValues.includes(value as T)) {
      throw new Error(`Invalid enum value: ${value}`);
    }
    return value as T;
  };
}

export function parseCsvParam(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildListQuery<TWhere extends QueryWhere = QueryWhere>(
  searchParams: URLSearchParams,
  options: BuildListQueryOptions<TWhere> = {},
): ListQueryResult<TWhere> {
  const limit = getBoundedNumber(
    searchParams.get(ListQueryParam.LIMIT),
    options.defaultLimit ?? DEFAULT_LIMIT,
    options.maxLimit ?? DEFAULT_MAX_LIMIT,
  );
  const page = getPositiveNumber(searchParams.get(ListQueryParam.PAGE), 1);
  const search = normalizeString(searchParams.get(ListQueryParam.SEARCH));
  const orderBy = buildOrderBy(searchParams, options);
  const filterWhere = buildFilterWhere(searchParams, options.filterFields ?? {});
  const searchWhere = buildSearchWhere(search, options.searchFields ?? []);
  const where = mergeWhere(options.baseWhere, filterWhere.where, searchWhere);

  return {
    filters: filterWhere.values,
    orderBy,
    pagination: {
      limit,
      page,
      skip: (page - 1) * limit,
      take: limit,
    },
    search,
    where,
  };
}

function buildOrderBy(
  searchParams: URLSearchParams,
  options: BuildListQueryOptions,
): Record<string, SortOrder> {
  const defaultSort = options.defaultSort ?? DEFAULT_SORT;
  const sortBy = normalizeString(searchParams.get(ListQueryParam.SORT_BY));
  const sortOrder = normalizeSortOrder(searchParams.get(ListQueryParam.SORT_ORDER));

  if (!sortBy) {
    return defaultSort;
  }

  if (options.sortableFields?.length && !options.sortableFields.includes(sortBy)) {
    return defaultSort;
  }

  return { [sortBy]: sortOrder };
}

function buildFilterWhere(
  searchParams: URLSearchParams,
  filterFields: Record<string, FilterFieldConfig>,
) {
  const values: Record<string, unknown> = {};
  const whereParts: QueryWhere[] = [];

  for (const [key, config] of Object.entries(filterFields)) {
    const param = config.param ?? key;
    const rawValue =
      searchParams.get(param) ??
      searchParams.get(`filter.${param}`) ??
      searchParams.get(`filters.${param}`);
    const value = normalizeString(rawValue);

    if (!value) continue;

    const operator = config.operator ?? FilterOperator.EQUALS;
    const field = config.field ?? key;
    const parsedValue = parseFilterValue(value, operator, config.parse);

    values[key] = parsedValue;
    whereParts.push(buildFieldWhere(field, operator, parsedValue));
  }

  return {
    values,
    where: mergeWhere(...whereParts),
  };
}

function buildSearchWhere(search: string | null, searchFields: readonly string[]): QueryWhere {
  if (!search || searchFields.length === 0) {
    return {};
  }

  return {
    OR: searchFields.map((field) => ({
      [field]: {
        contains: search,
        mode: 'insensitive',
      },
    })),
  };
}

function buildFieldWhere(field: string, operator: FilterOperator, value: unknown): QueryWhere {
  if (operator === FilterOperator.EQUALS) {
    return { [field]: value };
  }

  if (isStringOperator(operator)) {
    return {
      [field]: {
        [operator]: value,
        mode: 'insensitive',
      },
    };
  }

  return {
    [field]: {
      [operator]: value,
    },
  };
}

function mergeWhere<TWhere extends QueryWhere>(
  ...whereParts: Array<QueryWhere | TWhere | undefined>
): TWhere {
  const compactWhereParts = whereParts.filter((wherePart): wherePart is QueryWhere =>
    Boolean(wherePart && Object.keys(wherePart).length),
  );

  if (compactWhereParts.length === 0) {
    return {} as TWhere;
  }

  if (compactWhereParts.length === 1) {
    return compactWhereParts[0] as TWhere;
  }

  return { AND: compactWhereParts } as unknown as TWhere;
}

function getPositiveNumber(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
}

function getBoundedNumber(value: string | null, fallback: number, max: number) {
  return Math.min(getPositiveNumber(value, fallback), max);
}

function normalizeString(value: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function normalizeSortOrder(value: string | null): SortOrder {
  return value === 'asc' ? 'asc' : 'desc';
}

function parseFilterValue(
  value: string,
  operator: FilterOperator,
  parse?: (value: string) => unknown,
) {
  if (
    operator === FilterOperator.IN ||
    operator === FilterOperator.HAS_EVERY ||
    operator === FilterOperator.HAS_SOME
  ) {
    return parseCsvParam(value).map((item) => (parse ? parse(item) : item));
  }

  return parse ? parse(value) : value;
}

function isStringOperator(operator: FilterOperator) {
  return (
    operator === FilterOperator.CONTAINS ||
    operator === FilterOperator.ENDS_WITH ||
    operator === FilterOperator.STARTS_WITH
  );
}
