import { FC } from 'react';
import { Item, Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';

export interface ItemLinkProps {
  item: WithIcon<Pick<Item, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, language }) => {
  return <EntityLink href={`/item/${item.id}`} entity={item} icon={icon} language={language}/>;
};
