import { BaseRecord } from './record';

export interface BaseRequest {
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
}

export interface BaseCreateRequest<T extends BaseRecord = BaseRecord> extends BaseRequest {
  body: Omit<T, 'id'>;
}

export interface BasePaginationRequest<Params extends object = object> extends BaseRequest {
  params?: {
    page?: number;
    limit?: number;
  } & Params &
    Record<string, unknown>;
}

export interface BaseGetByIdRequest extends BaseRequest {
  pathParams: {
    id: string;
  };
}

export interface BaseUpdateRequest<T extends BaseRecord = BaseRecord> extends BaseRequest {
  pathParams: {
    id: string;
  };
  body: Partial<Omit<T, 'id'>>;
}

export interface BaseDeleteRequest extends BaseRequest {
  pathParams: {
    id: string;
  };
}
