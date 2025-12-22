'use client';

import { postApi } from '@/apis/post';
import ScrollToTopButton from '@/components/shared/scroll-to-top-button';
import { useQuery } from '@tanstack/react-query';
import ListPostByTag from './components/list-post-by-tag';
import TopPosts from './components/top-posts';

const BlogFeature = () => {
  const { data: postsData } = useQuery({
    queryKey: ['posts', 'list', { status: 'published' }],
    queryFn: () => postApi.getPosts({ status: 'published' }),
  });

  const posts = postsData?.data || [];

  return (
    <div className="mt-8 flex flex-col gap-20 space-y-10 md:space-y-20 md:p-4">
      <TopPosts posts={posts} />
      <ListPostByTag />
      <ScrollToTopButton />
    </div>
  );
};

export default BlogFeature;
