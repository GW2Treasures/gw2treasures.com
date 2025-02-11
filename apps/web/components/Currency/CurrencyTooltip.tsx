import 'server-only';
import type { Gw2Api } from 'gw2-api-types';
import { ClientCurrencyTooltip } from './CurrencyTooltip.client';
import type { Language } from '@gw2treasures/database';
import { format } from 'gw2-tooltip-html';
import { parseIcon } from '@/lib/parseIcon';
import type { FC } from 'react';

export interface CurrencyTooltipProps {
  currency: Gw2Api.Currency;
  language: Language;
  hideTitle?: boolean;
}

export const CurrencyTooltip: FC<CurrencyTooltipProps> = async ({ currency, language, hideTitle }) => {
  const tooltip = await createTooltip(currency, language);

  return (
    <ClientCurrencyTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export function createTooltip(currency: Gw2Api.Currency, language: Language): CurrencyTooltip {
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
