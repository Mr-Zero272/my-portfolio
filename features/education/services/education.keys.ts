import { GetEducationRequest, GetEducationsRequest } from '../types';

export const educationQueryKeys = {
  all: ['education'] as const,
  lists: () => [...educationQueryKeys.all, 'list'] as const,
  list: (request?: GetEducationsRequest) => [...educationQueryKeys.all, 'list', request] as const,
  detail: (request: GetEducationRequest) => [...educationQueryKeys.all, 'detail', request.path?.id] as const,
};
