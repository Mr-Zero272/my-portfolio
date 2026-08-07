import { Post } from '@/lib/generated/prisma/client';
import { PostFormValues } from '../../schemas';

export const toPostFormValue = (
  post: Post & { authors?: { userId: string }[] },
): PostFormValues => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentHtml: post.contentHtml ?? undefined,
    keywords: post.keywords,
    featureImage: post.featureImage ?? undefined,
    imageCaption: post.imageCaption ?? undefined,
    likes: post.likes,
    views: post.views,
    shares: post.shares,
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    xMetaTitle: post.xMetaTitle ?? undefined,
    xMetaDescription: post.xMetaDescription ?? undefined,
    xMetaImage: post.xMetaImage ?? undefined,
    published: post.published,
    authorIds: post.authors?.map((a) => a.userId) ?? [],
  };
};
