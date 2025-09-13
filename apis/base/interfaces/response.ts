import { BaseRecord } from './record';

export interface BaseResponse<T = unknown> {
  data: T;
  status: 'error' | 'success';
  message?: string;
  statusCode: number;
}

export interface BaseCreateResponse<T extends BaseRecord = BaseRecord> extends BaseResponse {
  data: T;
}

export interface BasePaginationResponse<T extends BaseRecord = BaseRecord> extends BaseResponse {
  data: Array<T>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;

    // With legacy pagination
    totalDocs: number;
    totalPages: number;
  };
}

export interface BaseGetByIdResponse<T extends BaseRecord = BaseRecord> extends BaseResponse {
  data: T;
}

export interface BaseUpdateResponse<T extends BaseRecord = BaseRecord> extends BaseResponse {
  data: T;
}

export type BaseDeleteResponse = BaseResponse;
