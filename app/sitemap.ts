import { SITE_URL } from '@/configs/env';
import { PostService } from '@/services/post-service';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostSlugsRes = await PostService.getAllPostSlugs();

  const postUrls = allPostSlugsRes.data.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: `${SITE_URL}`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/about-me`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/favorite`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...((postUrls as MetadataRoute.Sitemap) || []),
  ];
}
