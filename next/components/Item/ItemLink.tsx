import { FC } from 'react';
import { Item, Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { Link } from '../Link/Link';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';

export interface ItemLinkProps {
  item: WithIcon<Pick<Item, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  locale?: Language;
}

export const ItemLink: FC<ItemLinkProps> = ({ item, icon = 32, locale }) => {
  return <Link href={`/item/${item.id}`} item={item} icon={icon} locale={locale}/>;
};
