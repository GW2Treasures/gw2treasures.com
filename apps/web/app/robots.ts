import { getCurrentUrl } from '@/lib/url';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = new URL('/sitemap', getCurrentUrl());

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
