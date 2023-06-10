import { FC } from 'react';
import { Currency, Item, Language } from '@gw2treasures/database';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';

export interface CurrencyLinkProps {
  currency: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const CurrencyLink: FC<CurrencyLinkProps> = ({ currency: item, icon = 32, language, revision }) => {
  const entity = getLinkProperties(item);

  return (
    <EntityLink href={`/currency/${item.id}${revision ? `/${revision}` : ''}`} entity={entity} icon={icon} language={language}/>
  );
};
