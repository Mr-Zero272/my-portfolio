'use client';

import ScrollToTopButton from '@/components/shared/scroll-to-top-button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IPostResponse } from '@/models';
import { formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import { Bookmark, Eye, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { LikePost } from './components/like-post';
import PostComment from './components/post-comment';
import ReadPost from './components/read-post';

interface PostPreviewFeatureProps {
  post: IPostResponse;
  locale?: string;
}

export function PostPreviewFeature({ post, locale = 'en' }: PostPreviewFeatureProps) {
  const dateLocale = locale === 'vi' ? vi : enUS;
  const publishDate = post.createdAt || post.updatedAt;
  const timeAgo = formatDistanceToNow(new Date(publishDate), {
    addSuffix: true,
    locale: dateLocale,
  });

  const firstAuthor = post.authors?.[0];

  // Parse HTML content safely
  const createMarkup = () => {
    return { __html: DOMPurify.sanitize(post.content || '') };
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-2 py-8 md:px-4">
        {/* Header */}
        <div className="mb-8">
          {/* Category */}
          {post.tags && post.tags.length > 0 && (
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
              {post.tags[0].name}
            </Badge>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl leading-tight font-bold">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && <p className="mb-6 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>}

          {/* Read button */}
          <ReadPost content={post.content || ''} showProgress={true} showEstimatedTime={true} className="mb-4" />

          {/* Author & Meta */}

          <div className="mb-6 flex items-center gap-4">
            <Avatar className="size-8 md:size-12">
              <AvatarImage src={firstAuthor?.avatar} alt={firstAuthor?.name} />
              <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{firstAuthor?.name}</p>
              <p className="text-sm text-muted-foreground">
                {timeAgo} • {Math.ceil((post.content?.length || 0) / 1000)} min read
              </p>
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="mb-8 flex items-center gap-4 border-y py-4 md:gap-6">
            <LikePost slug={post.slug} initialLikes={post.likes || 0} initialLikedBy={post.likedBy || []} />
            <AnimatedButton variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
              <Eye className="h-5 w-5" />
              {post.views || 0}
            </AnimatedButton>
            <AnimatedButton variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
              <Bookmark className="h-5 w-5" />0
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 dark:hover:text-white"
            >
              <Share2 className="h-5 w-5" />
              Share
            </AnimatedButton>
          </div>
        </div>

        {/* Feature Image */}
        {post.featureImage && (
          <div className="mb-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image src={post.featureImage} alt={post.title} fill className="object-cover" priority />
            </div>
            {post.imageCaption && <p className="mt-2 text-center text-sm text-gray-500 italic">{post.imageCaption}</p>}
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg mb-8 max-w-none prose-gray dark:prose-invert">
          <div
            className="prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic dark:prose-blockquote:border-gray-600 prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:rounded prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:text-gray-800 dark:prose-code:bg-gray-800 dark:prose-code:text-gray-100 prose-ol:list-decimal prose-ul:list-disc prose-li:leading-relaxed prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-lg prose-img:shadow-sm prose-hr:my-8 prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </article>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag._id.toString()} variant="secondary" className="rounded-full px-3 py-1 font-normal">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom Engagement */}
        <div className="flex items-center justify-between border-t border-gray-200 py-6">
          <div className="flex items-center gap-4">
            <AnimatedButton variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
              Comment
            </AnimatedButton>
            <AnimatedButton variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
              Share
            </AnimatedButton>
          </div>
          <AnimatedButton variant="outline" size="sm">
            <Bookmark className="h-4 w-4" />
            Save
          </AnimatedButton>
        </div>

        {/* Post comment */}
        <PostComment postId={post._id.toString()} />
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default PostPreviewFeature;
