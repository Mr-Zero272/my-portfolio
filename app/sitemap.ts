import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: '/', changeFrequency: 'monthly', priority: 1.0 },
    { url: '/about-me', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/projects', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/favorite', changeFrequency: 'weekly', priority: 0.7 },
  ];
}
