import { FC } from 'react';
import { Icon, Item, Language } from '@prisma/client';
import { IconSize } from './ItemIcon';
import { Link } from '../Link/Link';

export interface ItemLinkProps {
  item: Item & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, locale }) => {
  return <Link href={`/item/${item.id}`} item={item} icon={icon} locale={locale}/>;
};
