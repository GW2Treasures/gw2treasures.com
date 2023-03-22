import { Gw2Api } from 'gw2-api-types';
import { fetchApi } from './fetchApi';
import { groupEntitiesById } from './groupById';

export async function loadSkills(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=de&v=latest&ids=${ids.join(',')}`).then(normalizeSkills),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=en&v=latest&ids=${ids.join(',')}`).then(normalizeSkills),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=es&v=latest&ids=${ids.join(',')}`).then(normalizeSkills),
    fetchApi<Gw2Api.Skill[]>(`/v2/skills?lang=fr&v=latest&ids=${ids.join(',')}`).then(normalizeSkills),
  ]);

  console.log(`Fetched ${ids.length} skills in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(de, en, es, fr);
}

function normalizeSkill(skill: Gw2Api.Skill): Gw2Api.Skill {
  // stabilize random order of transform skills
  skill.transform_skills = skill.transform_skills?.sort();

  return skill;
}

function normalizeSkills(skills: Gw2Api.Skill[]) {
  return skills.map(normalizeSkill);
}
