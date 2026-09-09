'use client';

import CustomFallbackAvatar from '@/components/shared/custom-fallback-avatar';
import { ScrollToTopButton } from '@/components/shared/scroll-to-top-button';
import { TOCMinimap } from '@/components/toc-minimap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buildTocFromPost } from '@/features/blogs/utils/table-of-contents';
import { PostWithAllRelations } from '@/features/posts/types';
import { formatRelativeTime } from '@/lib/format';
import { Bookmark, Eye, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
// import { LikePost } from './components/like-post';
// import ReadPost from './components/read-post';

interface PostPreviewFeatureProps {
  post: PostWithAllRelations;
}

export function BlogDetailPage({ post }: PostPreviewFeatureProps) {
  // const dateLocale = locale === 'vi' ? vi : enUS;
  const publishDate = post.createdAt || post.updatedAt;
  const timeAgo = formatRelativeTime(publishDate, 'N/A');

  console.log({ post });

  const firstAuthor = post.authors?.[0];

  // Build sanitized HTML (heading có id) + TOC items từ Lexical JSON
  const { html: articleHtml, items: tocItems } = useMemo(
    () => buildTocFromPost(post.content || '', post.contentHtml || ''),
    [post.content, post.contentHtml],
  );

  return (
    <div className="bg-background relative min-h-screen flex-1 px-4">
      {/* TOC minimap — floating cạnh trái, ẩn trên mobile */}
      <div className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden lg:flex">
        <div className="pointer-events-auto my-auto">
          <TOCMinimap items={tocItems} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-2 py-8 md:px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Category */}
          {post.tags && post.tags.length > 0 && (
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              {post.tags[0]?.tag.name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl leading-tight font-bold">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground mb-6 text-xl leading-relaxed">{post.excerpt}</p>
          )}

          {/* Read button */}
          {/* <ReadPost content={post.content || ''} showProgress={true} showEstimatedTime={true} className="mb-4" /> */}

          {/* Author & Meta */}

          <div className="mb-6 flex items-center gap-4">
            <Avatar className="size-8 md:size-12">
              <AvatarImage
                src={firstAuthor?.user?.image ?? undefined}
                alt={firstAuthor?.user?.name || 'Anonymous'}
              />
              <AvatarFallback>
                <CustomFallbackAvatar name={firstAuthor?.user?.name || 'Anonymous'} size={32} />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{firstAuthor?.user?.name ?? 'Anonymous author'}</p>
              <p className="text-muted-foreground text-sm">
                {timeAgo} • {Math.ceil((post.content?.length || 0) / 1000)} min read
              </p>
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="mb-8 flex items-center gap-4 border-y py-4 md:gap-6">
            {/* <LikePost slug={post.slug} initialLikes={post.likes || 0} initialLikedBy={post.likes || []} /> */}
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
              <Eye className="h-5 w-5" />
              {post.views || 0}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
              <Bookmark className="h-5 w-5" />0
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:hover:text-white"
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
        </div>

        {/* Feature Image */}
        {post.featureImage && (
          <div className="mb-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.featureImage?.url ?? undefined}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.imageCaption && (
              <p className="mt-2 text-center text-sm text-gray-500 italic">{post.imageCaption}</p>
            )}
          </div>
        )}

        {/* Content */}
        <article className="typeset typeset-docs">
          <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
        </article>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t.id} variant="secondary" className="rounded-full px-3 py-1 font-normal">
                {t.tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom Engagement */}
        <div className="flex items-center justify-between border-t border-gray-200 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4" />
            Save
          </Button>
        </div>

        {/* Post comment */}
        {/* <PostComment postId={post._id.toString()} /> */}
      </div>
      <ScrollToTopButton />
    </div>
  );
}
