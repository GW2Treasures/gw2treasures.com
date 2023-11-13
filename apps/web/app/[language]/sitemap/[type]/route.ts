import { getCurrentUrl } from '@/lib/url';
import { NextRequest } from 'next/server';
import { pageSize, sitemaps } from '../sitemaps';
import { notFound } from 'next/navigation';

export async function GET(request: NextRequest, { params: { type }}: { params: { type: string }}) {
  if(!(type in sitemaps)) {
    notFound();
  }

  const url = getCurrentUrl();
  url.pathname = '/sitemap';

  const count = await sitemaps[type].getCount();

  const pageCount = Math.ceil(count / pageSize);
  const pages = Array(pageCount).fill(undefined);

  const sitemapXml = pages
    .map((_, page) => `<sitemap><loc>${url}/${type}/${page}</loc></sitemap>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}
