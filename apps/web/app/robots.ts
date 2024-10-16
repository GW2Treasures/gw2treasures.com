import { getCurrentUrl } from '@/lib/url';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const sitemapUrl = new URL('/sitemap', await getCurrentUrl());

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth',
      ],
      crawlDelay: 5,
    }, {
      userAgent: ['barkrowler', 'AhrefsBot', 'ImagesiftBot', 'SemrushBot', 'ClaudeBot', 'SemrushBot', 'AwarioSmartBot', 'AwarioRssBot'],
      crawlDelay: 60,
    }],
    sitemap: sitemapUrl.toString(),
  };
}
