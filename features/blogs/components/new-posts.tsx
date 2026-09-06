'use client';

import { MOBILE_BREAKPOINT } from '@/constants/breakpoints';
import type { PostWithAllRelations } from '@/features/posts/types';
import { useMediaQuery } from '@mantine/hooks';
import PostCard from './post-card';

type NewPostsProps = {
  /** Latest posts (server-fetched via public API). */
  posts: PostWithAllRelations[];
};

export const NewPosts = ({ posts }: NewPostsProps) => {
  const isSmallScreen = useMediaQuery(MOBILE_BREAKPOINT);

  if (posts.length === 0) {
    return (
      <p className="px-2 text-center text-muted-foreground lg:px-20">
        No posts published yet — check back soon.
      </p>
    );
  }

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
  );
};
