
import { env } from '@/config/env';
import { postApi } from '@/features/posts/services';
import type { MetadataRoute } from 'next';

export const revalidate = 3600; // ISR: revalidate mỗi 1 giờ
export const dynamic = 'force-dynamic'; // Bắt buộc dynamic rendering

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostSlugsRes = await postApi.getAllPostSlugs();

  const postUrls = allPostSlugsRes.data.map((slugData) => ({
    url: `${env.SITE_URL}/blogs/${slugData.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: `${env.SITE_URL}`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${env.SITE_URL}/about-me`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${env.SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${env.SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${env.SITE_URL}/favorite`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${env.SITE_URL}/blogs`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${env.SITE_URL}/changelog`, changeFrequency: 'monthly', priority: 0.7 },
    ...((postUrls as MetadataRoute.Sitemap) || []),
  ];
}