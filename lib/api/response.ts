import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiErrorCode, AppError, isAppError } from './errors';

export type ApiMeta = Record<string, unknown>;

export type ApiSuccessResponse<TData, TMeta extends ApiMeta = ApiMeta> = {
  data: TData;
  meta?: TMeta;
  success: true;
};

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    details?: unknown;
    message: string;
  };
  success: false;
};

export type PaginationMeta = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

type JsonResponseInit = ResponseInit & {
  meta?: ApiMeta;
};

export function apiOk<TData>(data: TData, init: JsonResponseInit = {}) {
  const { meta, ...responseInit } = init;

  return Response.json(
    {
      data,
      ...(meta ? { meta } : {}),
      success: true,
    } satisfies ApiSuccessResponse<TData>,
    responseInit,
  );
}

export function apiCreated<TData>(data: TData, init: JsonResponseInit = {}) {
  return apiOk(data, { ...init, status: init.status ?? 201 });
}

export function apiPaginated<TData>(
  data: TData,
  pagination: Pick<PaginationMeta, 'limit' | 'page' | 'total'>,
  init: JsonResponseInit = {},
) {
  return apiOk(data, {
    ...init,
    meta: {
      ...init.meta,
      pagination: createPaginationMeta(pagination.total, pagination.page, pagination.limit),
    },
  });
}

export function apiError(error: AppError) {
  return Response.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(typeof error.details !== 'undefined' ? { details: error.details } : {}),
      },
      success: false,
    } satisfies ApiErrorResponse,
    { status: error.status },
  );
}

export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    limit,
    page,
    total,
    totalPages,
  };
}

export function handleApiError(error: unknown) {
  if (isAppError(error)) {
    return apiError(error);
  }

  if (error instanceof ZodError) {
    return apiError(
      new AppError(ApiErrorCode.VALIDATION_ERROR, {
        details: error.issues,
      }),
    );
  }

  if (error instanceof SyntaxError) {
    return apiError(new AppError(ApiErrorCode.BAD_REQUEST, { message: 'Malformed JSON body' }));
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return apiError(
        new AppError(ApiErrorCode.CONFLICT, { message: 'A record with this value already exists.' }),
      );
    }

    if (error.code === 'P2025') {
      return apiError(new AppError(ApiErrorCode.NOT_FOUND));
    }
  }

  return apiError(new AppError(ApiErrorCode.INTERNAL_SERVER_ERROR));
}

type RouteHandler<Args extends unknown[] = unknown[]> = (
  ...args: Args
) => Promise<Response> | Response;

export function withApiErrorHandling<Args extends unknown[]>(handler: RouteHandler<Args>) {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(error);
      return handleApiError(error);
    }
  };
}
