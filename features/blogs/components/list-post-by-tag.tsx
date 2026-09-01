'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfinitePosts } from '@/features/posts/hooks/queries';
import { useTagsWithMostPosts } from '@/features/tags/hooks/queries';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import PostCard, { PostCardSkeleton } from './post-card';

export const ListPostByTag = () => {
  const [tag, setTag] = useState<string>();

  const {
    data: tagsWithPosts,
    isLoading,
    isError,
  } = useTagsWithMostPosts();

  const {
    data: postsByTag,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPostsByTag,
  } = useInfinitePosts({
    query: {
      limit: 8,
      filters: { tagId: tag },
    },
  });

  const posts = useMemo(
    () => postsByTag?.pages.flatMap((page) => page.list) ?? [],
    [postsByTag],
  );

  if (isError) {
    throw new Error('Error loading tags');
  }

  const tags = tagsWithPosts?.list ?? [];

  return (
    <div className="space-y-10 md:px-5">
      <div className="flex flex-col items-center justify-center gap-1">
        <h2 className="text-2xl font-bold">Browse by Tag</h2>
        <p className="text-muted-foreground">Select a tag to see more related posts</p>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-24 rounded-full" />
          ))}
        {!isLoading && (
          <>
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
          </>
        )}
      </div>

      {/* List post */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {(isLoadingPostsByTag || isLoading) && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <PostCardSkeleton key={index} variant="vertical" />
              ))}
            </>
          )}
          {posts.map((post) => (
            <PostCard variant="vertical" key={post.id} post={post} isHasHoverEffect />
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              className="border-primary dark:text-muted-foreground text-primary hover:text-primary rounded-full"
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
              {isFetchingNextPage
                ? 'Loading more'
                : hasNextPage
                  ? 'Load more'
                  : 'Nothing more to load'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
