import { FC } from 'react';
import { ApiItem } from '../../lib/apiTypes';

export interface ItemTooltipProps {
  item: ApiItem;
}

export const ItemTooltip: FC<ItemTooltipProps> = ({ item }) => {
  return (<>
    {item.type === 'Weapon' && `Strength: ${item.details?.min_power} – ${item.details?.max_power}`}
    {item.type === 'Armor' && `Defense: ${item.details?.defense}`}
  </>);
};
