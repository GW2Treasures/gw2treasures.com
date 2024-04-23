'use client';

import { FormatNumber } from '@/components/Format/FormatNumber';
import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import type { LocalizedEntity } from '@/lib/localizedName';
import type { WithIcon } from '@/lib/with';
import type { ContentChance, Item } from '@gw2treasures/database';
import type { FC } from 'react';

export interface ContentChanceColumnProps {
  content: { chance: ContentChance }
}

export const ContentChanceColumn: FC<ContentChanceColumnProps> = ({ content }) => {
  return <>{content.chance}</>;
};

export interface ContentQuantityColumnProps {
  content: { quantity: number }
}

export const ContentQuantityColumn: FC<ContentQuantityColumnProps> = ({ content }) => {
  return <FormatNumber value={content.quantity}/>;
};

export interface ItemContentQuantityColumnProps {
  item: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
  content: { quantity: number }
}

export const ItemContentQuantityColumn: FC<ItemContentQuantityColumnProps> = ({ content, item }) => {
  return <OutputCount count={content.quantity}><ItemLink item={item}/></OutputCount>;
};
