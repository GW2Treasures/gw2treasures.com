import type { FC } from 'react';
import type { Item, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { Tooltip } from '../Tooltip/Tooltip';
import { ItemLinkTooltip } from './ItemLinkTooltip';
import { getLinkProperties } from '@/lib/linkProperties';

export interface ItemLinkProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, language, revision }) => {
  const entity = getLinkProperties(item);

  return (
    <Tooltip content={<ItemLinkTooltip item={entity} language={language} revision={revision}/>}>
      <EntityLink href={`/item/${item.id}${revision ? `/${revision}` : ''}`} entity={entity} icon={icon} language={language}/>
    </Tooltip>
  );
};
