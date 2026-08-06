import { Post } from '@/lib/generated/prisma/client';
import { PostFormValues } from '../../schemas';

export const toPostFormValue = (post: Post): PostFormValues => {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    contentHtml: post.contentHtml,
    keywords: post.keywords,
    featureImage: post.featureImage,
    imageCaption: post.imageCaption,
    likes: post.likes,
    views: post.views,
    shares: post.shares,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    xMetaTitle: post.xMetaTitle,
    xMetaDescription: post.xMetaDescription,
    xMetaImage: post.xMetaImage,
    published: post.published,
  };
};
