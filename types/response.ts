export interface BaseResponse<T> {
  status: string;
  message?: string;
  error?: string;
  data: T;
}

export interface BasePaginationResponse<T> {
  status: string;
  message?: string;
  error?: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
