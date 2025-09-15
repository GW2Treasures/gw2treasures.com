import 'server-only';

import type { FC } from 'react';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { parseIcon } from '@/lib/parseIcon';
import { db } from '@/lib/prisma';
import type { SkillFact, SkillFactTraited } from '@gw2api/types/data/skill';
import type { Trait } from '@gw2api/types/data/trait';
import type { Language } from '@gw2treasures/database';
import { groupById } from '@gw2treasures/helper/group-by';
import { type TraitLinkProps } from './TraitLink';
import { ClientTraitTooltip } from './TraitTooltip.client';

export interface TraitTooltipProps {
  trait: Trait,
  language: Language,
  hideTitle?: boolean,
}

export const TraitTooltip: FC<TraitTooltipProps> = async ({ trait, language, hideTitle }) => {
  const tooltip = await createTooltip(trait, language);

  return (
    <ClientTraitTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export type SkillFactTraitedTooltip = SkillFactTraited & { trait?: TraitLinkProps['trait'] };

export interface TraitTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  slot: Trait.Slot,
  description?: string,
  facts?: SkillFact[],
  traited_facts?: SkillFactTraitedTooltip[],
}

export async function createTooltip(trait: Trait, language: Language): Promise<TraitTooltip> {
  const icon = parseIcon(trait.icon);

  const affectedByTraits = groupById(await db.trait.findMany({
    where: { affectsTraits: { some: { id: trait.id }}},
    select: { ...linkPropertiesWithoutRarity, slot: true }
  }));

  return {
    language,
    name: trait.name,
    icon,
    slot: trait.slot,
    description: trait.description,
    facts: trait.facts,
    traited_facts: trait.traited_facts?.map((fact) => ({ ...fact, trait: affectedByTraits.get(fact.requires_trait) })),
  };
}
