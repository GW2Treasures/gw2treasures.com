import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadAchievements(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=de&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=en&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=es&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=fr&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} achievements in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

export async function loadAchievementCategories() {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement.Category[]>('/v2/achievements/categories?lang=de&ids=all'),
    fetchApi<Gw2Api.Achievement.Category[]>('/v2/achievements/categories?lang=en&ids=all'),
    fetchApi<Gw2Api.Achievement.Category[]>('/v2/achievements/categories?lang=es&ids=all'),
    fetchApi<Gw2Api.Achievement.Category[]>('/v2/achievements/categories?lang=fr&ids=all'),
  ]);

  console.log(`Fetched ${en.length} achievement categories in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

export async function loadAchievementGroups() {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement.Group[]>('/v2/achievements/groups?lang=de&ids=all'),
    fetchApi<Gw2Api.Achievement.Group[]>('/v2/achievements/groups?lang=en&ids=all'),
    fetchApi<Gw2Api.Achievement.Group[]>('/v2/achievements/groups?lang=es&ids=all'),
    fetchApi<Gw2Api.Achievement.Group[]>('/v2/achievements/groups?lang=fr&ids=all'),
  ]);

  console.log(`Fetched ${en.length} achievement groups in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

