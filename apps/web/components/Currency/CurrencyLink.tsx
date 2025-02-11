import type { FC } from 'react';
import type { Currency, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { CurrencyLinkTooltip } from './CurrencyLinkTooltip';

export interface CurrencyLinkProps {
  currency: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const CurrencyLink: FC<CurrencyLinkProps> = ({ currency, icon = 32, language, revision }) => {
  const entity = getLinkProperties(currency);

  return (
    <Tooltip content={<CurrencyLinkTooltip currency={entity} language={language} revision={revision}/>}>
      <EntityLink href={`/currency/${currency.id}${revision ? `/${revision}` : ''}`} entity={entity} icon={icon} language={language}/>
    </Tooltip>
  );
};
