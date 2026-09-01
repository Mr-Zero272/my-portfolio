
import StateUI from '@/components/shared/state-ui';
import { env } from '@/config/env';
import { BlogDetailPage } from '@/features/blogs/pages';
import { PostWithAllRelations } from '@/features/posts/types';
import { ApiResponse } from '@/types/api';
import { TriangleAlert } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ postSlug: string }>;
}

const getPostBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${env.SITE_URL}/api/public/posts/${slug}`, {
      next: { revalidate: 60 * 60 }, // Revalidate every 1 hour
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch post data');
    }
    return res.json() as Promise<ApiResponse<PostWithAllRelations>>;
  } catch (error) {
    console.warn('Failed to fetch post during build:', error);
    // Trả về dữ liệu mặc định khi không thể fetch
    return {
      data: null,
      message: 'Post not found',
      success: false,
    };
  }
};

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { postSlug } = await params;

  try {
    const res = await getPostBySlug(postSlug);
    const post = res.data;
    if (!post) {
      return {
        title: 'Article Not Found',
        description: 'Article not found on Piti blog',
      };
    }

    // Extract plain text from HTML content for description
    const plainTextExcerpt = post.excerpt
      ? post.excerpt.replace(/<[^>]*>/g, '').trim()
      : post.content
        ? post.content
          .replace(/<[^>]*>/g, '')
          .substring(0, 160)
          .trim() + '...'
        : 'Read this article on Piti blog';

    const metaTitle = post.metaTitle || post.title || 'Article';
    const metaDescription = post.metaDescription || plainTextExcerpt;

    // Always use English version as canonical URL for consistency
    const canonicalUrl = `${env.SITE_URL}/blog/${post.slug}`;

    const ogImage = post.featureImage
      ? post?.featureImage?.url?.startsWith('http')
        ? post.featureImage?.url
        : `https://pitithuong.vercel.app/og.png`
      : 'https://pitithuong.vercel.app/og.png';

    const xTitle = post.xMetaTitle || metaTitle;
    const xDescription = post.xMetaDescription || metaDescription;
    const xImage = post.xMetaImage || ogImage;

    // Get author information
    const authorName = 'Pitithuong';

    // Get tags for keywords
    const tags = post.tags?.map((tag) => tag.tag.name) || [];
    const keywords = [
      post.title,
      post.title + ' | Piti blog',
      post.title + ' | Piti blog',
      ...tags,
      ...(post.keywords || []),
    ].filter(Boolean);

    const publishDate = post.createdAt || post.updatedAt;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: keywords.join(', '),
      authors: [{ name: authorName }],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        type: 'article',
        siteName: 'Piti blog',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title || 'Article image',
          },
        ],
        locale: 'en_US',
        alternateLocale: ['en_US'],
        ...(publishDate && { publishedTime: publishDate }),
        authors: [authorName],
        section: post.tags?.[0]?.tag.name || 'General',
        tags: tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: xTitle,
        description: xDescription,
        images: [xImage],
        creator: `@Pitithuong`,
        site: '@Pitithuong',
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `https://tapnews.teknix.services/en/posts/${post.slug}`,
          vi: `https://tapnews.teknix.services/vi/posts/${post.slug}`,
          'x-default': `https://tapnews.teknix.services/en/posts/${post.slug}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'article:author': authorName,
        ...(publishDate && { 'article:published_time': new Date(publishDate).toISOString() }),
        'article:section': post.tags?.[0]?.tag?.name || 'General',
        'article:tag': tags.join(','),
        // Add Facebook specific meta tags
        'og:site_name': 'Thuong Phan Thanh Portfolio',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata if post not found
    return {
      title: 'Article Not Found | Piti blog',
      description: 'The requested article could not be found on Piti blog.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

const BlogDetailRootPage = async ({ params }: BlogDetailPageProps) => {
  const { postSlug } = await params;
  const postResponse = await getPostBySlug(postSlug);

  if (!postResponse.data) {
    return (
      <StateUI
        variant='error'
        icon={<TriangleAlert />}
        title="Post not found or server unavailable"
        description="The requested post could not be found or the server is unavailable."
        className='border-none'
      />
    );
  }

  return (
    <>
      <BlogDetailPage post={postResponse.data as PostWithAllRelations} />
      {/* <ViewCounter slug={slug} /> */}
    </>
  );
};

export default BlogDetailRootPage;