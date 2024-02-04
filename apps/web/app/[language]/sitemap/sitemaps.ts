import { db } from '@/lib/prisma';
import { getAlternateUrls } from '@/lib/url';

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
      const items = await db.item.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return items.map((item) => getEntryForUrl(
        `/item/${item.id}`,
        { lastmod: item.updatedAt }
      ));

    }
  },
  'skills': {
    getCount() {
      return db.skill.count();
    },

    async getEntries(skip, take) {
      const skills = await db.skill.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skills.map((skill) => getEntryForUrl(
        `/skill/${skill.id}`,
        { lastmod: skill.updatedAt }
      ));

    }
  },
  'achievements': {
    getCount() {
      return db.achievement.count();
    },

    async getEntries(skip, take) {
      const achievements = await db.achievement.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievements.map((achievement) => getEntryForUrl(
        `/achievement/${achievement.id}`,
        { lastmod: achievement.updatedAt }
      ));
    }
  },
  'achievement-categories': {
    getCount() {
      return db.achievementCategory.count();
    },

    async getEntries(skip, take) {
      const achievementCategories = await db.achievementCategory.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievementCategories.map((category) => getEntryForUrl(
        `/achievement/category/${category.id}`,
        { lastmod: category.updatedAt }
      ));
    }
  },
  'builds': {
    getCount() {
      return db.build.count();
    },

    async getEntries(skip, take) {
      const builds = await db.build.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return builds.map((build) => getEntryForUrl(`/build/${build.id}`, { lastmod: build.updatedAt }));
    }
  },
  'currencies': {
    getCount() {
      return db.currency.count();
    },

    async getEntries(skip, take) {
      const currencies = await db.currency.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return currencies.map((currency) => getEntryForUrl(`/currency/${currency.id}`, { lastmod: currency.updatedAt }));
    }
  },
  'skins': {
    getCount() {
      return db.skin.count();
    },

    async getEntries(skip, take) {
      const skins = await db.skin.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skins.map((skin) => getEntryForUrl(`/skin/${skin.id}`, { lastmod: skin.updatedAt }));
    }
  },
  'static': {
    getCount() {
      // always returning 1 is okay because 1 page will always be enough for all static pages
      return 1;
    },

    getEntries() {
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
      ].map((page) => getEntryForUrl(page));
    }
  }
};

function getEntryForUrl(pathname: string, additionalProps: Omit<SitemapEntry, 'url' | 'alternates'> = {}): SitemapEntry {
  const alternates = getAlternateUrls(pathname);
  console.log(alternates);

  return {
    url: alternates.canonical,
    alternates: Object.entries(alternates.languages).map(([lang, href]) => ({ lang, href })),
    ...additionalProps
  };
}

export const getSitemapsForType = (baseUrl: string) => async (type: keyof typeof sitemaps) => {
  const count = await sitemaps[type].getCount();

  const pageCount = Math.ceil(count / pageSize);
  const pages = Array(pageCount).fill(undefined);

  const sitemapXml = pages
    .map((_, page) => `<sitemap><loc>${baseUrl}/${type}/${page}</loc></sitemap>`)
    .join('');

  return sitemapXml;
};

