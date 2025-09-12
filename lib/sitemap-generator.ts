import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export const generateSitemap = async (): Promise<string> => {
  const siteUrl = process.env.SITE_URL || 'https://pitithuong.vercel.app';

  const staticPageTemplate = [
    { url: '/', changefreq: 'monthly', priority: 1.0 },
    { url: '/about-me', changefreq: 'monthly', priority: 0.9 },
    { url: '/contact', changefreq: 'monthly', priority: 0.9 },
    { url: '/projects', changefreq: 'monthly', priority: 0.9 },
    { url: '/favorite', changefreq: 'weekly', priority: 0.7 },
  ];

  // dynamic links will be added here later

  const allPages = [...staticPageTemplate];

  // create stream sitemap
  const stream = new SitemapStream({ hostname: siteUrl });
  const readableStream = Readable.from(allPages);

  const sitemapStream = readableStream.pipe(stream);
  const xmlString = await streamToPromise(sitemapStream).then((data) => data.toString());
  return xmlString;
};
