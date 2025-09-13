import axios from 'axios';
import {
  BaseCreateRequest,
  BaseDeleteRequest,
  BaseGetByIdRequest,
  BasePaginationRequest,
  BaseRecord,
  BaseUpdateRequest,
} from '../interfaces';
import { BaseCreateResponse, BasePaginationResponse } from '../interfaces/response';
import { BaseApiClient } from './client';

interface BaseCrudApiClientOptions {
  baseUrl: string;
}

export class BaseCrudApiClient<T extends BaseRecord = BaseRecord> extends BaseApiClient {
  constructor({ baseUrl }: BaseCrudApiClientOptions) {
    super(axios.create({ baseURL: baseUrl }));
  }

  create(request: BaseCreateRequest<T>): Promise<BaseCreateResponse<T>> {
    return this.client.post('', request.body);
  }

  getAll(request: BasePaginationRequest): Promise<BasePaginationResponse<T>> {
    return this.client.get('', { params: request.params });
  }

  getById(request: BaseGetByIdRequest): Promise<BaseCreateResponse<T>> {
    return this.client.get(`/${request.pathParams.id}`);
  }

  update(request: BaseUpdateRequest<T>): Promise<BaseCreateResponse<T>> {
    return this.client.put(`/${request.pathParams.id}`, request.body);
  }

  delete(request: BaseDeleteRequest): Promise<BaseCreateResponse<T>> {
    return this.client.delete(`/${request.pathParams.id}`);
  }
}
