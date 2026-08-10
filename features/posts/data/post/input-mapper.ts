import { GalleryImage, Post, PostTag } from '@/lib/generated/prisma/client';
import { PostFormValues } from '../../schemas';

export const toPostFormValue = (
  post: Post & {
    authors?: { userId: string }[];
    featureImage?: GalleryImage | null;
    tags?: PostTag[];
  },
): PostFormValues & { featureImage?: GalleryImage | null } => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    contentHtml: post.contentHtml ?? undefined,
    keywords: post.keywords,
    featureImageId: post.featureImageId ?? undefined,
    imageCaption: post.imageCaption ?? undefined,
    likes: post.likes,
    views: post.views,
    shares: post.shares,
    metaTitle: post.metaTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    xMetaTitle: post.xMetaTitle ?? undefined,
    xMetaDescription: post.xMetaDescription ?? undefined,
    xMetaImage: post.xMetaImage ?? undefined,
    status: post.status,
    authorIds: post.authors?.map((a) => a.userId) ?? [],
    tagIds: post.tags?.map((t) => t.tagId) ?? [],
    featureImage: post.featureImage,
  };
};
