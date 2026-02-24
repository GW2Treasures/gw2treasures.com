import 'server-only';
import { ClientMiniTooltip } from './MiniTooltip.client';
import type { Language } from '@gw2treasures/database';
import type { FC } from 'react';
import { parseIcon } from '@/lib/parseIcon';
import type { Mini } from '@gw2api/types/data/mini';

export interface MiniTooltipProps {
  mini: Mini,
  language: Language,
  hideTitle?: boolean,
}

export const MiniTooltip: FC<MiniTooltipProps> = async ({ mini, language, hideTitle }) => {
  const tooltip = await createTooltip(mini, language);

  return (
    <ClientMiniTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export function createTooltip(mini: Mini, language: Language): MiniTooltip {
  const icon = parseIcon(mini.icon);

  return {
    language,
    name: mini.name,
    icon,
    description: mini.unlock,
  };
}

export interface MiniTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  description?: string,
}
