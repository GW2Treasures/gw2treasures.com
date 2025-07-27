import { db } from '@/lib/prisma';
import { getAlternateUrls } from '@/lib/url';
import type { Language } from '@gw2treasures/database';

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
  getEntries(language: Language, skip: number, take: number): SitemapEntry[] | Promise<SitemapEntry[]>
}

export const pageSize = 20_000;

export const sitemaps: Record<string, Sitemap> = {
  'items': {
    getCount() {
      return db.item.count();
    },

    async getEntries(language, skip, take) {
      const items = await db.item.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return items.map((item) => getEntryForUrl(
        language,
        `/item/${item.id}`,
        { lastmod: item.updatedAt }
      ));

    }
  },
  'skills': {
    getCount() {
      return db.skill.count();
    },

    async getEntries(language, skip, take) {
      const skills = await db.skill.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skills.map((skill) => getEntryForUrl(
        language,
        `/skill/${skill.id}`,
        { lastmod: skill.updatedAt }
      ));

    }
  },
  'traits': {
    getCount() {
      return db.trait.count();
    },

    async getEntries(language, skip, take) {
      const traits = await db.trait.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return traits.map((trait) => getEntryForUrl(
        language,
        `/traits/${trait.id}`,
        { lastmod: trait.updatedAt }
      ));

    }
  },
  'achievements': {
    getCount() {
      return db.achievement.count();
    },

    async getEntries(language, skip, take) {
      const achievements = await db.achievement.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievements.map((achievement) => getEntryForUrl(
        language,
        `/achievement/${achievement.id}`,
        { lastmod: achievement.updatedAt }
      ));
    }
  },
  'achievement-categories': {
    getCount() {
      return db.achievementCategory.count();
    },

    async getEntries(language, skip, take) {
      const achievementCategories = await db.achievementCategory.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return achievementCategories.map((category) => getEntryForUrl(
        language,
        `/achievement/category/${category.id}`,
        { lastmod: category.updatedAt }
      ));
    }
  },
  'builds': {
    getCount() {
      return db.build.count();
    },

    async getEntries(language, skip, take) {
      const builds = await db.build.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return builds.map((build) => getEntryForUrl(language, `/build/${build.id}`, { lastmod: build.updatedAt }));
    }
  },
  'currencies': {
    getCount() {
      return db.currency.count();
    },

    async getEntries(language, skip, take) {
      const currencies = await db.currency.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return currencies.map((currency) => getEntryForUrl(language, `/currency/${currency.id}`, { lastmod: currency.updatedAt }));
    }
  },
  'skins': {
    getCount() {
      return db.skin.count();
    },

    async getEntries(language, skip, take) {
      const skins = await db.skin.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return skins.map((skin) => getEntryForUrl(language, `/skin/${skin.id}`, { lastmod: skin.updatedAt }));
    }
  },
  'minis': {
    getCount() {
      return db.mini.count();
    },

    async getEntries(language, skip, take) {
      const minis = await db.mini.findMany({ skip, take, select: { id: true, updatedAt: true }});

      return minis.map((mini) => getEntryForUrl(language, `/minis/${mini.id}`, { lastmod: mini.updatedAt }));
    }
  },
  'static': {
    getCount() {
      // always returning 1 is okay because 1 page will always be enough for all static pages
      return 1;
    },

    getEntries(language) {
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

        // wizards vault
        '/wizards-vault',
        '/wizards-vault/objectives',
        '/wizards-vault/rewards',

        // homestead
        '/homestead/nodes',
        '/homestead/garden-plots',
        '/homestead/cats',
        '/homestead/decorations',
        '/homestead/materials',
        '/homestead/glyphs',

        // wardrobe
        '/skins',
        '/outfits',
        '/colors',
        '/gliders',
        '/minis',

        // instances
        '/fractals',
        '/raids',
        '/dungeons',

        // festivals
        '/festival/wintersday',
        '/festival/wintersday/achievements',
        '/festival/wintersday/skins',
        '/festival/wintersday/minis',
        '/festival/wintersday/wizards-vault',
        '/festival/lunar-new-year',
        '/festival/lunar-new-year/achievements',
        '/festival/lunar-new-year/skins',
        '/festival/lunar-new-year/minis',
        '/festival/lunar-new-year/wizards-vault',
        '/festival/super-adventure',
        '/festival/super-adventure/box',
        '/festival/super-adventure/achievements',
        '/festival/super-adventure/skins',
        '/festival/super-adventure/minis',
        '/festival/super-adventure/wizards-vault',
        '/festival/dragon-bash',
        '/festival/dragon-bash/achievements',
        '/festival/dragon-bash/skins',
        '/festival/dragon-bash/minis',
        '/festival/dragon-bash/wizards-vault',
        '/festival/four-winds',
        '/festival/four-winds/achievements',
        '/festival/four-winds/skins',
        '/festival/four-winds/minis',
        '/festival/four-winds/wizards-vault',
        '/festival/four-winds/zephyrite-box',
        '/bonus-event/evon-gnashblades-birthday',

        // legendary armory
        '/legendary/weapons',
        '/legendary/armor',
        '/legendary/trinkets',
        '/legendary/relics',
      ].map((page) => getEntryForUrl(language, page));
    }
  }
};

function getEntryForUrl(currentLanguage: Language, pathname: string, additionalProps: Omit<SitemapEntry, 'url' | 'alternates'> = {}): SitemapEntry {
  const alternates = getAlternateUrls(pathname, currentLanguage);

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

