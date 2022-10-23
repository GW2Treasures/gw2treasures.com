import { FC, ReactNode } from 'react';
import { ApiItem } from '../../lib/apiTypes';

export interface ItemTooltipProps {
  item: ApiItem;
}


export const ItemTooltip: FC<ItemTooltipProps> = ({ item }) => {

  const data: ReactNode[] = [
    item.type === 'Weapon' && `Strength: ${item.details?.min_power} – ${item.details?.max_power}`,
    item.type === 'Armor' && `Defense: ${item.details?.defense}`,
    // attributes,
    // consumable,
    // bonus,
    // upgrade slot
    // infusions
    // color
    // skin
    item.rarity,
    item.details?.type,
    item.details?.weight_class,
    item.level !== 0 && `Level: ${item.level}`,
    // required race
    item.description,
    item.flags.includes('Unique') && 'Unique',
    item.flags.includes('AccountBound') && `Account Bound`,
    item.flags.includes('SoulbindOnAcquire') ? 'Soulbound on Acquire' :
    item.flags.includes('SoulBindOnUse') && 'Soulbound on Use',
    item.flags.includes('NoSalvage') && 'Not salvagable',
    item.flags.includes('NoSell') ? 'Not sellable' : item.vendor_value,

  ];

  return data.filter(Boolean).map((content) => <div style={{ marginBottom: 8 }}>{content}</div>);
};
