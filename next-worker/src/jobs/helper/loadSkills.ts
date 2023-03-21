import { Language } from '@prisma/client';
import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';

export async function loadSkills(ids: number[]): Promise<{ [key in Language]: Gw2Api.Skill }[]> {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=de&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=en&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=es&v=latest&ids=${ids.join(',')}`),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=fr&v=latest&ids=${ids.join(',')}`),
  ]);

  console.log(`Fetched ${ids.length} skills in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  const skills = en.map((skill) => ({
    en: normalizeSkill(skill),
    de: normalizeSkill(de.find(({ id }) => id === skill.id)!),
    es: normalizeSkill(es.find(({ id }) => id === skill.id)!),
    fr: normalizeSkill(fr.find(({ id }) => id === skill.id)!),
  }));

  return skills;
}

function normalizeSkill(skill: Gw2Api.Skill): Gw2Api.Skill {
  // stabilize random order of transform skills
  skill.transform_skills = skill.transform_skills?.sort();

  return skill;
}
