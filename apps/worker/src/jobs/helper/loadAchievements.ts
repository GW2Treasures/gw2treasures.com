import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';

export async function loadAchievements(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/achievements?ids=${ids.join(',')}`, { language: 'de' }),
    fetchApi(`/v2/achievements?ids=${ids.join(',')}`, { language: 'en' }),
    fetchApi(`/v2/achievements?ids=${ids.join(',')}`, { language: 'es' }),
    fetchApi(`/v2/achievements?ids=${ids.join(',')}`, { language: 'fr' }),
  ]);

  console.log(`Fetched ${ids.length} achievements in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

export async function loadAchievementCategories() {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi('/v2/achievements/categories?ids=all', { language: 'de' }),
    fetchApi('/v2/achievements/categories?ids=all', { language: 'en' }),
    fetchApi('/v2/achievements/categories?ids=all', { language: 'es' }),
    fetchApi('/v2/achievements/categories?ids=all', { language: 'fr' }),
  ]);

  console.log(`Fetched ${en.length} achievement categories in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

export async function loadAchievementGroups() {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi('/v2/achievements/groups?ids=all', { language: 'de' }),
    fetchApi('/v2/achievements/groups?ids=all', { language: 'en' }),
    fetchApi('/v2/achievements/groups?ids=all', { language: 'es' }),
    fetchApi('/v2/achievements/groups?ids=all', { language: 'fr' }),
  ]);

  console.log(`Fetched ${en.length} achievement groups in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

