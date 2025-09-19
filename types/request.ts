export interface BaseRequestCreate<T> {
  queryParameters?: Record<string, undefined | string | number | boolean>;
  variables: T;
}

export interface BaseRequestUpdate<T> {
  id: string;
  queryParameters?: Record<string, undefined | string | number | boolean>;
  variables: T;
}

export interface BaseRequestGetList {
  page?: number;
  limit?: number;
  queryParameters?: Record<string, undefined | string | number | boolean>;
}

export interface BaseRequestGetById {
  id: string;
  queryParameters?: Record<string, undefined | string | number | boolean>;
}

export interface BaseRequestDelete {
  id: string;
  queryParameters?: Record<string, undefined | string | number | boolean>;
}
