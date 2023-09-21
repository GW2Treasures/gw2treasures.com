import { getLanguage } from '@/components/I18n/getTranslate';
import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';

interface SitemapEntry {
  url: string | URL;
  lastmod?: Date;
  alternates?: {
    lang: string;
    href: string | URL;
  }[]
}

interface Sitemap {
  getCount(): Promise<number>
  getEntries(skip: number, take: number): Promise<SitemapEntry[]>
}

export const pageSize = 20_000;

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export const sitemaps: Record<string, Sitemap> = {
  'items': {
    getCount() {
      return db.item.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const items = await db.item.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return items.map((item) => ({
        url: new URL(`/item/${item.id}`, url),
        lastmod: item.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/item/${item.id}`, base) }))
      }));
    }
  },
  'skills': {
    getCount() {
      return db.skill.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const skills = await db.skill.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skills.map((skill) => ({
        url: new URL(`/skill/${skill.id}`, url),
        lastmod: skill.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/skill/${skill.id}`, base) }))
      }));
    }
  },
};

function getLocalizedBaseUrls() {
  const url = getCurrentUrl();
  const language = getLanguage();

  const urlDefault = new URL(url);
  urlDefault.hostname = baseDomain;
  const urlDe = new URL(url);
  urlDe.hostname = `de.${baseDomain}`;
  const urlEn = new URL(url);
  urlEn.hostname = `en.${baseDomain}`;
  const urlEs = new URL(url);
  urlEs.hostname = `es.${baseDomain}`;
  const urlFr = new URL(url);
  urlFr.hostname = `fr.${baseDomain}`;

  return [
    { lang: 'x-default', base: urlDefault },
    { lang: 'de', base: urlDe },
    { lang: 'en', base: urlDe },
    { lang: 'es', base: urlEs },
    { lang: 'fr', base: urlFr },
  ];
}
