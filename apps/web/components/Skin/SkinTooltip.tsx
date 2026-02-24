import 'server-only';
import { ClientSkinTooltip } from './SkinTooltip.client';
import type { Language, Rarity } from '@gw2treasures/database';
import type { FC } from 'react';
import { getTranslate, type TranslationId } from '@/lib/translate';
import { parseIcon } from '@/lib/parseIcon';
import type { Skin } from '@gw2api/types/data/skin';

export interface SkinTooltipProps {
  skin: Skin,
  language: Language,
  hideTitle?: boolean,
}

export const SkinTooltip: FC<SkinTooltipProps> = async ({ skin, language, hideTitle }) => {
  const tooltip = await createTooltip(skin, language);

  return (
    <ClientSkinTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export function createTooltip(skin: Skin, language: Language): SkinTooltip {
  const t = getTranslate(language);
  const icon = parseIcon(skin.icon);

  return {
    language,
    name: skin.name,
    icon,
    description: skin.description,
    type: skin.details?.type ? t(`item.type.${skin.type}.${skin.details.type}` as TranslationId) : t(`item.type.${skin.type}`),
    rarity: {
      label: t(`rarity.${skin.rarity}`),
      value: skin.rarity
    },
    weight: skin.details?.weight_class ? t(`weight.${skin.details.weight_class}`) : undefined,
  };
}

export interface SkinTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  description?: string,
  type: string,
  rarity: {
    label: string,
    value: Rarity,
  },
  weight?: string,
}
