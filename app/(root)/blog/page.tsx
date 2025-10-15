import { API_URL } from '@/configs/env';
import BlogFeature from '@/features/blogs';
import BlogsSkeleton from '@/features/blogs/components/blogs-skeleton';
import { IPost, ITag } from '@/models';
import { BasePaginationResponse } from '@/types/response';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Force dynamic rendering để tránh lỗi build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My blogs | Thuong Phan Thanh',
  description:
    'Explore my technical blogs, tutorials, and insights on web development, programming, and technology trends. Stay updated with the latest in the tech world through my articles.',
  keywords: [
    'Thuong Phan Thanh blogs',
    'technical articles',
    'web development tutorials',
    'programming insights',
    'technology trends',
    'developer blog',
    'coding tips',
    'software development',
    'tech news',
    'programming guides',
  ],
  openGraph: {
    title: 'My blogs | Thuong Phan Thanh',
    description:
      'Explore my technical blogs, tutorials, and insights on web development, programming, and technology trends. Stay updated with the latest in the tech world through my articles.',
    url: 'https://pitithuong.vercel.app/blog',
    type: 'website',
    images: [
      {
        url: '/images/projects/portfolio/my-portfolio-h-1.png',
        width: 1200,
        height: 630,
        alt: 'My blogs - Thuong Phan Thanh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My blogs | Thuong Phan Thanh',
    description:
      'Explore my technical blogs, tutorials, and insights on web development, programming, and technology trends. Stay updated with the latest in the tech world through my articles.',
    images: ['/images/projects/portfolio/my-portfolio-h-1.png'],
  },
};

const getListPosts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/posts?status=published`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Thêm timeout để tránh treo quá lâu
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    return res.json() as Promise<BasePaginationResponse<Omit<IPost, 'tags'> & { tags: ITag[] }>>;
  } catch (error) {
    console.warn('Failed to fetch posts during build:', error);
    // Trả về dữ liệu rỗng khi không thể fetch
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }
};

const BlogPage = async () => {
  const postsData = await getListPosts();
  return (
    <Suspense fallback={<BlogsSkeleton />}>
      <BlogFeature posts={postsData.data} />
    </Suspense>
  );
};

export default BlogPage;
