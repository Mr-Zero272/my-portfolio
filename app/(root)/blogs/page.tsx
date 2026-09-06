import { env } from '@/config/env';
import { ListBlogsPage } from '@/features/blogs';
import type { PostWithAllRelations } from '@/features/posts/types';
import type { TagWithPostCount } from '@/features/tags/types';
import { publicGet, publicList } from '@/lib/server-fetch';
import type { Metadata } from 'next';

const SITE_URL = env.SITE_URL ?? 'https://pitithuong.vercel.app';

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
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
  openGraph: {
    title: 'My blogs | Thuong Phan Thanh',
    description:
      'Explore my technical blogs, tutorials, and insights on web development, programming, and technology trends. Stay updated with the latest in the tech world through my articles.',
    url: `${SITE_URL}/blogs`,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/images/projects/portfolio/my-portfolio-h-1.png`,
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
    images: [`${SITE_URL}/images/projects/portfolio/my-portfolio-h-1.png`],
  },
};

const BlogPage = async () => {
  // Server-fetched via the public API and ISR-cached for 1 hour.
  const [newPosts, tags, initialPosts] = await Promise.all([
    publicGet<PostWithAllRelations[]>('posts?limit=3'),
    publicGet<TagWithPostCount[]>('tags/most-posts'),
    publicList<PostWithAllRelations>('posts?limit=8'),
  ]);

  return (
    <ListBlogsPage newPosts={newPosts ?? []} tags={tags ?? []} initialPosts={initialPosts} />
  );
};

export default BlogPage;