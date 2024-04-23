import { getCurrentUrl } from '@/lib/url';
import { getSitemapsForType, sitemaps } from './sitemaps';

export async function GET() {
  const url = getCurrentUrl();

  const sitemapXml = (await Promise.all(Object.keys(sitemaps).map(getSitemapsForType(url.toString())))).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}
