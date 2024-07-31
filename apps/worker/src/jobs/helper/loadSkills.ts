import { fetchApi } from './fetchApi';
import { groupLocalizedEntitiesById } from './groupById';
import { Skill } from '@gw2api/types/data/skill';

export async function loadSkills(ids: number[]) {
  const start = new Date();

  const [de, en, es, fr] = await Promise.all([
    fetchApi(`/v2/skills?ids=${ids.join(',')}`, { language: 'de' }).then(normalizeSkills),
    fetchApi(`/v2/skills?ids=${ids.join(',')}`, { language: 'en' }).then(normalizeSkills),
    fetchApi(`/v2/skills?ids=${ids.join(',')}`, { language: 'es' }).then(normalizeSkills),
    fetchApi(`/v2/skills?ids=${ids.join(',')}`, { language: 'fr' }).then(normalizeSkills),
  ]);

  console.log(`Fetched ${ids.length} skills in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr);
}

function normalizeSkill(skill: Skill): Skill {
  // stabilize random order of transform skills
  skill.transform_skills = skill.transform_skills?.sort();

  return skill;
}

function normalizeSkills(skills: Skill[]) {
  return skills.map(normalizeSkill);
}
