import 'server-only';

import type { Language } from '@gw2treasures/database';
import { ClientSkillTooltip } from './SkillTooltip.client';
import type { FC } from 'react';
import { parseIcon } from '@/lib/parseIcon';
import type { Skill, SkillFact, SkillFactTraited } from '@gw2api/types/data/skill';
import { groupById } from '@gw2treasures/helper/group-by';
import { db } from '@/lib/prisma';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { TraitLinkProps } from '../Trait/TraitLink';

export interface SkillTooltipProps {
  skill: Skill;
  language: Language;
  hideTitle?: boolean;
}

export const SkillTooltip: FC<SkillTooltipProps> = async ({ skill, language, hideTitle }) => {
  const tooltip = await createTooltip(skill, language);

  return (
    <ClientSkillTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export type SkillFactTraitedTooltip = SkillFactTraited & { trait?: TraitLinkProps['trait'] };

export interface SkillTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  description?: string,
  facts?: SkillFact[],
  traited_facts?: SkillFactTraitedTooltip[],
}

export async function createTooltip(skill: Skill, language: Language): Promise<SkillTooltip> {
  const icon = parseIcon(skill.icon);

  const affectedByTraits = groupById(await db.trait.findMany({
    where: { affectsSkills: { some: { id: skill.id }}},
    select: { ...linkPropertiesWithoutRarity, slot: true }
  }));

  return {
    language,
    name: skill.name,
    icon,
    description: skill.description,
    facts: skill.facts,
    traited_facts: skill.traited_facts?.map((fact) => ({ ...fact, trait: affectedByTraits.get(fact.requires_trait) })),
  };
}
