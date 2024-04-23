import { NextRequest } from 'next/server';
import { pageSize, sitemaps } from '../../sitemaps';
import { notFound } from 'next/navigation';

export async function GET(_: NextRequest, { params: { type, page }}: { params: { type: string, page: string }}) {
  if(!(type in sitemaps)) {
    notFound();
  }

  const currentPage = parseInt(page);

  if(isNaN(currentPage) || currentPage < 0) {
    notFound();
  }

  const entries = await sitemaps[type].getEntries(pageSize * currentPage, pageSize);

  const sitemapXml = entries
    .map((entry) => {
      const loc = `<loc>${entry.url.toString()}</loc>`;
      const lastMod = entry.lastmod ? `<lastmod>${entry.lastmod.toISOString()}</lastmod>` : '';
      const alternates = (entry.alternates ?? [])
        .map(({ lang, href }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
        .join('');

      return `<url>${loc}${lastMod}${alternates}</url>`;
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemapXml}</urlset>`, {
    headers: {
      'content-type': 'application/xml; charset=utf8'
    }
  });
}
