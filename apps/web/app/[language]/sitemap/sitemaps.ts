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
  getCount(): number | Promise<number>
  getEntries(skip: number, take: number): SitemapEntry[] | Promise<SitemapEntry[]>
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
  'achievements': {
    getCount() {
      return db.achievement.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const achievements = await db.achievement.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievements.map((achievement) => ({
        url: new URL(`/achievement/${achievement.id}`, url),
        lastmod: achievement.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/achievement/${achievement.id}`, base) }))
      }));
    }
  },
  'achievement-categories': {
    getCount() {
      return db.achievementCategory.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const achievementCategories = await db.achievementCategory.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievementCategories.map((category) => ({
        url: new URL(`/achievement/category/${category.id}`, url),
        lastmod: category.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/achievement/category/${category.id}`, base) }))
      }));
    }
  },
  'builds': {
    getCount() {
      return db.build.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const builds = await db.build.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return builds.map((build) => ({
        url: new URL(`/build/${build.id}`, url),
        lastmod: build.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/build/${build.id}`, base) }))
      }));
    }
  },
  'currencies': {
    getCount() {
      return db.currency.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const currencies = await db.currency.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return currencies.map((currency) => ({
        url: new URL(`/currency/${currency.id}`, url),
        lastmod: currency.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/currency/${currency.id}`, base) }))
      }));
    }
  },
  'skins': {
    getCount() {
      return db.skin.count();
    },

    async getEntries(skip, take) {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      const skins = await db.skin.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skins.map((skin) => ({
        url: new URL(`/skin/${skin.id}`, url),
        lastmod: skin.updatedAt,
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(`/skin/${skin.id}`, base) }))
      }));
    }
  },
  'static': {
    getCount() {
      // always returning 1 is okay because 1 page will always be enough for all static pages
      return 1;
    },

    getEntries() {
      const url = getCurrentUrl();
      const alternateBaseUrls = getLocalizedBaseUrls();

      return [
        '/',
        '/about',
        '/status',
        '/status/jobs',
        '/status/api',
        '/dev',
        '/dev/icons',
        '/dev/api',
        '/login',
        '/review',
        '/item/empty-containers',
        '/achievement/uncategorized',
      ].map((page) => ({
        url: new URL(page, url),
        alternates: alternateBaseUrls.map(({ lang, base }) => ({ lang, href: new URL(page, base) }))
      }));
    }
  }
};

function getLocalizedBaseUrls() {
  const url = getCurrentUrl();

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
