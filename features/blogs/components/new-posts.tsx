'use client';

import StateWrapper from '@/components/shared/state-wrapper';
import { MOBILE_BREAKPOINT } from '@/constants/breakpoints';
import { usePosts } from '@/features/posts';
import { useMediaQuery } from '@mantine/hooks';
import PostCard, { PostCardSkeleton } from './post-card';
export const NewPosts = () => {
  const isSmallScreen = useMediaQuery(MOBILE_BREAKPOINT)
  const { data: posts, isLoading, error } = usePosts({
    query: {
      limit: 3,
      filters: { status: 'Published' },
    },
  });

  return (
    <StateWrapper isLoading={isLoading} error={error} data={posts?.list} fallbackLoading={<NewPostsSkeleton />}>
      {(posts) => {
        const firstPost = posts[0];
        return (
          <div className="space-y-5 px-2 lg:px-20">
            <PostCard isMainPost isDisplayExcerpt post={firstPost} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {posts.slice(1, 3).map((post) => (
                <PostCard key={post.id} post={post} isDisplayExcerpt={isSmallScreen} />
              ))}
            </div>
          </div>
        )
      }}
    </StateWrapper>
  )
};

export const NewPostsSkeleton = () => {
  return (
    <div className="space-y-5 px-2 md:px-10">
      <PostCardSkeleton isMainPost isDisplayExcerpt />
      <div className="grid grid-cols-2 gap-4">
        <PostCardSkeleton isDisplayExcerpt />
        <PostCardSkeleton isDisplayExcerpt />
      </div>
    </div>
  );
};
