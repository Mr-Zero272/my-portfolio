'use client';

import { ScrollToTopButton } from '@/components/shared/scroll-to-top-button';
import type { PostWithAllRelations } from '@/features/posts/types';
import type { TagWithPostCount } from '@/features/tags/types';
import type { ListResponse } from '@/types/api';
import { ListPostByTag, NewPosts } from '../components';

export type ListBlogsPageProps = {
  /** Latest posts (server-fetched via public API). */
  newPosts: PostWithAllRelations[];
  /** Tags with the most posts (server-fetched via public API). */
  tags: TagWithPostCount[];
  /** First "All" page (server-fetched) — seeds the infinite list for an instant first paint. */
  initialPosts: ListResponse<PostWithAllRelations> | null;
};

export const ListBlogsPage = ({ newPosts, tags, initialPosts }: ListBlogsPageProps) => {
  return (
    <div className="mt-8 flex flex-col gap-20 space-y-10 md:space-y-20 md:p-4">
      <NewPosts posts={newPosts} />
      <ListPostByTag tags={tags} initialPosts={initialPosts} />
      <ScrollToTopButton />
    </div>
  );
};