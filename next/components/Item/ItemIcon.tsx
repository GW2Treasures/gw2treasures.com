import { Item } from '@prisma/client';
import { FC } from 'react';

export interface ItemIconProps {
  item: Pick<Item, 'signature' | 'file_id'>;
  size?: 16 | 32 | 64
}

function getUrl(item: ItemIconProps['item'], size: number) {
  return `https://icons-gw2.darthmaim-cdn.com/${item.signature}/${item.file_id}-${size}px.png`;
}

export const ItemIcon: FC<ItemIconProps> = ({ item, size = 64 }) => {
  return <img src={getUrl(item, size)} width={size} height={size} alt="" crossOrigin="anonymous" loading="lazy" srcSet={size < 64 ? `${getUrl(item, size * 2)} 2x` : undefined}/>
};
