import { env } from '@/config/env';
import type { ApiResponse, ListResponse } from '@/types/api';

/**
 * Default ISR revalidation window (seconds) for public data fetched in
 * Server Components. Content updates at most once per hour.
 */
export const PUBLIC_REVALIDATE_SECONDS = 60 * 60; // 1 hour

type PublicFetchOptions = {
  /** Cache lifetime in seconds. Defaults to 1 hour (ISR). */
  revalidate?: number;
};

/**
 * Server-side fetch against an internal public API route (`/api/public/*`).
 * Responses are cached for `revalidate` seconds (ISR) — see the Next.js
 * "Time-based revalidation" docs for the previous (non-Cache-Components) model.
 * Returns `null` on any failure so callers can fall back gracefully.
 */
export async function publicFetch<T>(
  path: string,
  options: PublicFetchOptions = {},
): Promise<ApiResponse<T> | null> {
  const { revalidate = PUBLIC_REVALIDATE_SECONDS } = options;
  const url = `${env.SITE_URL}/api/public/${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.warn(`[publicFetch] ${res.status} ${url}`);
      return null;
    }

    return (await res.json()) as ApiResponse<T>;
  } catch (error) {
    console.warn(`[publicFetch] failed ${url}:`, error);
    return null;
  }
}

/** Returns just the `data` payload of a public endpoint (or `null`). */
export async function publicGet<T>(
  path: string,
  options?: PublicFetchOptions,
): Promise<T | null> {
  const res = await publicFetch<T>(path, options);
  return res?.data ?? null;
}

/** Returns a public list endpoint shaped as `{ list, meta }` (or `null`). */
export async function publicList<T>(
  path: string,
  options?: PublicFetchOptions,
): Promise<ListResponse<T> | null> {
  const res = await publicFetch<T[]>(path, options);
  if (!res) return null;
  return { list: res.data ?? [], meta: res.meta };
}
