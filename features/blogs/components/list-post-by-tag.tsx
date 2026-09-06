'use client';

import { Button } from '@/components/ui/button';
import { useInfinitePosts } from '@/features/posts/hooks/queries';
import type { PostWithAllRelations } from '@/features/posts/types';
import type { TagWithPostCount } from '@/features/tags/types';
import type { ListResponse } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import PostCard, { PostCardSkeleton } from './post-card';

type ListPostByTagProps = {
  /** Tags fetched server-side (public API) — shown instantly, no extra request. */
  tags: TagWithPostCount[];
  /** First "All" page fetched server-side — seeds the infinite list for an instant first paint. */
  initialPosts: ListResponse<PostWithAllRelations> | null;
};

export const ListPostByTag = ({ tags, initialPosts }: ListPostByTagProps) => {
  const [tag, setTag] = useState<string>();

  const {
    data: postsByTag,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPostsByTag,
  } = useInfinitePosts(
    {
      query: {
        limit: 8,
        filters: { tagId: tag },
      },
    },
    {
      // Seed the default "All" list with the server-fetched first page.
      initialPage: tag === undefined ? initialPosts ?? undefined : undefined,
    },
  );

  const posts = useMemo(
    () => postsByTag?.pages.flatMap((page) => page.list) ?? [],
    [postsByTag],
  );

  const isEmpty = !isLoadingPostsByTag && posts.length === 0;

  return (
    <div className="space-y-10 md:px-5">
      <div className="flex flex-col items-center justify-center gap-1">
        <h2 className="text-2xl font-bold">Browse by Tag</h2>
        <p className="text-muted-foreground">Select a tag to see more related posts</p>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5">
        <Button
          variant={!tag ? 'default' : 'outline'}
          className="rounded-full"
          size="lg"
          onClick={() => setTag(undefined)}
        >
          All
        </Button>
        {tags.map((t) => (
          <Button
            key={t.id}
            variant={t.id === tag ? 'default' : 'outline'}
            className="rounded-full"
            size="lg"
            onClick={() => setTag(t.id)}
          >
            {t.name} ({t.postCount})
          </Button>
        ))}
      </div>

      {/* List post */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {isLoadingPostsByTag && posts.length === 0 && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <PostCardSkeleton key={index} variant="vertical" />
              ))}
            </>
          )}
          {posts.map((post) => (
            <PostCard variant="vertical" key={post.id} post={post} isHasHoverEffect />
          ))}
          {isEmpty && (
            <p className="col-span-full py-10 text-center text-muted-foreground">
              No posts found for this tag.
            </p>
          )}
        </div>

        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              className="border-primary text-primary hover:text-primary dark:text-muted-foreground rounded-full"
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
              {isFetchingNextPage ? 'Loading more' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
