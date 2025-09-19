import { SITE_URL } from '@/configs/env';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${SITE_URL}/about-me`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/favorite`, changeFrequency: 'weekly', priority: 0.7 },
  ];
}
