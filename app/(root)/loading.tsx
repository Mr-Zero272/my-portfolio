import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

/**
 * App-level loading fallback for public `(root)` pages. Shown while a page's
 * server-side `fetch` (public API) is still pending during navigation.
 */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 px-4 py-16"
    >
      <Spinner className="size-8 animate-spin text-muted-foreground" />
      <div className="w-full max-w-2xl space-y-5">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
