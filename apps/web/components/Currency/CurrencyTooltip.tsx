import 'server-only';
import { ClientCurrencyTooltip } from './CurrencyTooltip.client';
import type { Language } from '@gw2treasures/database';
import { format } from 'gw2-tooltip-html';
import { parseIcon } from '@/lib/parseIcon';
import type { FC } from 'react';
import type { Currency } from '@gw2api/types/data/currency';

export interface CurrencyTooltipProps {
  currency: Currency,
  language: Language,
  hideTitle?: boolean,
}

export const CurrencyTooltip: FC<CurrencyTooltipProps> = async ({ currency, language, hideTitle }) => {
  const tooltip = await createTooltip(currency, language);

  return (
    <ClientCurrencyTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export function createTooltip(currency: Currency, language: Language): CurrencyTooltip {
  return {
    language,
    name: currency.name || '???',
    icon: parseIcon(currency.icon),
    description: currency.description ? format(currency.description) : undefined,
  };
}

export interface CurrencyTooltip {
  language: Language,
  name: string,
  icon?: { id: number, signature: string },
  description?: string,
}
