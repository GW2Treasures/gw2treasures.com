import { getCurrentUrl } from '@/lib/url';
import { sitemaps } from './sitemaps';

export function GET() {
  const url = getCurrentUrl();

  const sitemapXml = Object.keys(sitemaps)
    .map((type) => `<sitemap><loc>${url}/${type}</loc></sitemap>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}
