import { QueryClient } from '@tanstack/react-query';

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the shared browser QueryClient, creating it lazily on first call.
 *
 * Unlike the `useQueryClient` hook, this is safe to call outside React context
 * (e.g. from the upload adapter's cache invalidation). Only valid on the client.
 */
export function getBrowserQueryClient(): QueryClient {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
  }
  return browserQueryClient;
}
