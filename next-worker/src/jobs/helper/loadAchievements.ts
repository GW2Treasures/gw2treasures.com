import { Language } from "@prisma/client";
import { Gw2Api } from "gw2-api-types";
import { fetchApi } from "./fetchApi";

export async function loadAchievements(ids: number[]): Promise<{ [key in Language]: Gw2Api.Achievement }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=de&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=en&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=es&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Achievement[]>(`/v2/achievements?lang=fr&v=latest&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} achievements in ${(new Date().valueOf() - start.valueOf()) / 1000}s`)

  const achievements = en.map((achievement) => ({
    en: achievement,
    de: de.find(({ id }) => id === achievement.id)!,
    es: es.find(({ id }) => id === achievement.id)!,
    fr: fr.find(({ id }) => id === achievement.id)!,
  }));

  return achievements;
}

export async function loadAchievementCategories(): Promise<{ [key in Language]: Gw2Api.Achievement.Category }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement.Category[]>(`/v2/achievements/categories?lang=de&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Category[]>(`/v2/achievements/categories?lang=en&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Category[]>(`/v2/achievements/categories?lang=es&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Category[]>(`/v2/achievements/categories?lang=fr&v=latest&ids=all`),
  ]);

  console.log(`Fetched ${en.length} achievement categories in ${(new Date().valueOf() - start.valueOf()) / 1000}s`)

  const categories = en.map((category) => ({
    en: category,
    de: de.find(({ id }) => id === category.id)!,
    es: es.find(({ id }) => id === category.id)!,
    fr: fr.find(({ id }) => id === category.id)!,
  }));

  return categories;
}

export async function loadAchievementGroups(): Promise<{ [key in Language]: Gw2Api.Achievement.Group }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Achievement.Group[]>(`/v2/achievements/groups?lang=de&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Group[]>(`/v2/achievements/groups?lang=en&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Group[]>(`/v2/achievements/groups?lang=es&v=latest&ids=all`),
    fetchApi<Gw2Api.Achievement.Group[]>(`/v2/achievements/groups?lang=fr&v=latest&ids=all`),
  ]);

  console.log(`Fetched ${en.length} achievement groups in ${(new Date().valueOf() - start.valueOf()) / 1000}s`)

  const groups = en.map((groups) => ({
    en: groups,
    de: de.find(({ id }) => id === groups.id)!,
    es: es.find(({ id }) => id === groups.id)!,
    fr: fr.find(({ id }) => id === groups.id)!,
  }));

  return groups;
}

