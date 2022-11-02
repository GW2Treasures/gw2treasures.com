import { FC, ReactNode } from 'react';
import { ApiItem } from '../../lib/apiTypes';
import { parseItems } from 'gw2e-item-attributes';
import { ItemAttributes } from './ItemAttributes';
import { format } from 'gw2-tooltip-html';
import { Coins } from '../Format/Coins';

export interface ItemTooltipProps {
  item: ApiItem;
}

export const ItemTooltip: FC<ItemTooltipProps> = ({ item }) => {

  const data: ReactNode[] = [
    item.type === 'Weapon' && `Strength: ${item.details?.min_power} – ${item.details?.max_power}`,
    item.type === 'Armor' && `Defense: ${item.details?.defense}`,
    <ItemAttributes attributes={parseItems([item])}/>,
    // consumable,
    // bonus,
    // upgrade slot
    // infusions
    // color
    // skin
    <span style={{ color: 'var(--color-rarity)' }}>{item.rarity}</span>,
    item.details?.type,
    item.details?.weight_class,
    item.level !== 0 && `Level: ${item.level}`,
    item.restrictions.length > 0 && `Requires: ${item.restrictions.join(', ')}`,
    item.description && <div dangerouslySetInnerHTML={{ __html: format(item.description) }}></div>,
    item.flags.includes('Unique') && 'Unique',
    item.flags.includes('AccountBound') && `Account Bound`,
    item.flags.includes('SoulbindOnAcquire') ? 'Soulbound on Acquire' :
    item.flags.includes('SoulBindOnUse') && 'Soulbound on Use',
    item.flags.includes('NoSalvage') && 'Not salvagable',
    item.flags.includes('NoSell') ? 'Not sellable' : <Coins value={item.vendor_value}/>,

  ];

  return <div>
    {data.filter(Boolean).map((content) => <div style={{ marginBottom: 8 }}>{content}</div>)}
  </div>;
};
