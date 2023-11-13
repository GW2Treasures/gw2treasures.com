/* eslint-disable @next/next/no-img-element */
import type { Gw2Api } from 'gw2-api-types';
import type { AsyncComponent } from '@/lib/asyncComponent';
import type { Language } from '@gw2treasures/database';
import { ClientSkillTooltip } from './SkillTooltip.client';

export interface SkillTooltipProps {
  skill: Gw2Api.Skill;
  language: Language;
}


export const SkillTooltip: AsyncComponent<SkillTooltipProps> = async ({ skill, language }) => {
  const tooltip = await createTooltip(skill, language);

  return (
    <ClientSkillTooltip tooltip={tooltip}/>
  );
};

export interface SkillTooltip {
  language: Language,
  description: string,
  facts?: Gw2Api.Skill['facts'],
  traited_facts?: Gw2Api.Skill['traited_facts'],
}

// eslint-disable-next-line require-await
export async function createTooltip(skill: Gw2Api.Skill, language: Language): Promise<SkillTooltip> {
  return {
    language,
    description: skill.description,
    facts: skill.facts,
    traited_facts: skill.traited_facts,
  };
}
