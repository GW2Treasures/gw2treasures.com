import { FC, ReactNode } from 'react';
import { ApiItem } from '../../lib/apiTypes';
import { parseItems } from 'gw2e-item-attributes';
import { ItemAttributes } from './ItemAttributes';
import { format } from 'gw2-tooltip-html';
import { Coins } from '../Format/Coins';
import { FormatNumber } from '../Format/FormatNumber';
import { Rarity } from './Rarity';

export interface ItemTooltipProps {
  item: ApiItem;
}

export const ItemTooltip: FC<ItemTooltipProps> = ({ item }) => {
  /* eslint-disable react/jsx-key */
  const data: ReactNode[] = [
    item.type === 'Weapon' && <>Strength: <FormatNumber value={item.details?.min_power}/> – <FormatNumber value={item.details?.max_power}/></>,
    item.type === 'Armor' && `Defense: ${item.details?.defense}`,
    <ItemAttributes attributes={parseItems([item])}/>,
    // consumable,
    // bonus,
    // upgrade slot
    // infusions
    // color
    // skin
    <Rarity rarity={item.rarity}/>,
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
  /* eslint-enable react/jsx-key */

  return <div>
    {data.filter(Boolean).map((content, index) => <div style={{ marginBottom: 8 }} key={index}>{content}</div>)}
  </div>;
};
