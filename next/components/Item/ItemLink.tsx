import { FC } from 'react';
import { Item, Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';
import { Tooltip } from '../Tooltip/Tooltip';
import { ItemLinkTooltip } from './ItemLinkTooltip';
import { getLinkProperties } from '@/lib/linkProperties';

export interface ItemLinkProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, language }) => {
  const entity = getLinkProperties(item);

  return (
    <Tooltip content={<ItemLinkTooltip item={entity} language={language}/>}>
      <EntityLink href={`/item/${item.id}`} entity={entity} icon={icon} language={language}/>
    </Tooltip>
  );
};
