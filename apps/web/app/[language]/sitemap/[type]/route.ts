import { getCurrentUrl } from '@/lib/url';
import { NextRequest } from 'next/server';
import { getSitemapsForType, sitemaps } from '../sitemaps';
import { notFound } from 'next/navigation';

export async function GET(_: NextRequest, props: { params: Promise<{ type: string }>}) {
  const params = await props.params;

  const {
    type
  } = params;

  if(!(type in sitemaps)) {
    notFound();
  }

  const url = getCurrentUrl();
  url.pathname = '/sitemap';

  const sitemapXml = await getSitemapsForType(url.toString())(type);

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapXml}</sitemapindex>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}
