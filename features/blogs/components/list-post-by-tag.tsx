'use client';

import { postApi } from '@/apis/post';
import { tagApi } from '@/apis/tag';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import PostCard, { PostCardSkeleton } from './post-card';

const ListPostByTag = () => {
  const [tag, setTag] = useState('all');
  const {
    data: tagsWithPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tags-with-posts'],
    queryFn: tagApi.getTagsWithMostPosts,
  });

  const {
    data: postsByTag,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isLoading: isLoadingPostsByTag,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ['posts-by-tag', tag],
    queryFn: ({ pageParam = 1 }) =>
      postApi.getPosts({ page: pageParam, limit: 4, tag: tag === 'all' ? undefined : tag }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });

  const posts = useMemo(() => postsByTag?.pages.flatMap((page) => page.data) ?? [], [postsByTag]);

  if (isError) {
    throw new Error('Error loading tags');
  }

  return (
    <div className="space-y-10 md:px-5">
      <div className="flex flex-col items-center justify-center gap-1">
        <h2 className="text-2xl font-bold">Browser by Tag</h2>
        <p className="text-muted-foreground">Select a tag to see more related posts</p>
      </div>
      {/* Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-10 w-24 rounded-full" />)}
        {tagsWithPosts && (
          <>
            <AnimatedButton
              variant={tag === 'all' ? 'default' : 'outline'}
              className="rounded-full"
              size="lg"
              onClick={() => setTag('all')}
            >
              All
            </AnimatedButton>
            {tagsWithPosts?.data?.map((t) => (
              <AnimatedButton
                key={t._id.toString()}
                variant={t._id.toString() === tag ? 'default' : 'outline'}
                className="rounded-full"
                size="lg"
                onClick={() => setTag(t._id.toString())}
              >
                <span>{t.name}</span> <span>({t.postCount})</span>
              </AnimatedButton>
            ))}
          </>
        )}
      </div>

      {/* List post */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {isLoadingPostsByTag && (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <PostCardSkeleton key={index} variant="vertical" />
              ))}
            </>
          )}
          {posts.map((post) => (
            <PostCard variant="vertical" key={post._id.toString()} post={post} isHasHoverEffect />
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center">
            <AnimatedButton onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchNextPageError}>
              {isFetchNextPageError ? 'Error loading more' : hasNextPage ? 'Load more' : 'Nothing more to load'}
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPostByTag;
