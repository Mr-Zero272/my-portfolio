import { ListBlogsPage } from '@/features/blogs';
import { Metadata } from 'next';

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

const BlogPage = async () => {

  return (
    <ListBlogsPage />
  )
};

export default BlogPage;