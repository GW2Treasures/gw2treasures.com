import { getCurrentUrl } from '@/lib/url';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = new URL('/sitemap', getCurrentUrl());

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/auth',
      ]
    },
    sitemap: sitemapUrl.toString(),
  };
}
