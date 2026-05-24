export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export const API_ERROR_STATUS = {
  [ApiErrorCode.BAD_REQUEST]: 400,
  [ApiErrorCode.UNAUTHORIZED]: 401,
  [ApiErrorCode.FORBIDDEN]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.VALIDATION_ERROR]: 422,
  [ApiErrorCode.CONFIGURATION_ERROR]: 500,
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 500,
} as const satisfies Record<ApiErrorCode, number>;

export const API_ERROR_MESSAGE = {
  [ApiErrorCode.BAD_REQUEST]: 'Bad request',
  [ApiErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ApiErrorCode.FORBIDDEN]: 'Forbidden',
  [ApiErrorCode.NOT_FOUND]: 'Resource not found',
  [ApiErrorCode.VALIDATION_ERROR]: 'Invalid payload',
  [ApiErrorCode.CONFIGURATION_ERROR]: 'Server configuration error',
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
} as const satisfies Record<ApiErrorCode, string>;

type ApiErrorOptions = {
  details?: unknown;
  message?: string;
  status?: number;
};

export class AppError extends Error {
  readonly code: ApiErrorCode;
  readonly details?: unknown;
  readonly status: number;

  constructor(code: ApiErrorCode, options: ApiErrorOptions = {}) {
    super(options.message ?? API_ERROR_MESSAGE[code]);

    this.name = 'AppError';
    this.code = code;
    this.details = options.details;
    this.status = options.status ?? API_ERROR_STATUS[code];
  }
}

export function createApiError(code: ApiErrorCode, options?: ApiErrorOptions) {
  return new AppError(code, options);
}

export function throwApiError(code: ApiErrorCode, options?: ApiErrorOptions): never {
  throw createApiError(code, options);
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
