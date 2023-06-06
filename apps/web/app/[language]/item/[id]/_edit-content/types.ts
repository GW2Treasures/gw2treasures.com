import { LocalizedEntity } from '@/lib/localizedName';
import { WithIcon } from '@/lib/with';
import { ContentChance } from '@gw2treasures/database';

export interface AddedItem {
  _id: string;
  item: WithIcon<{
    id: number;
    rarity: string;
  } & LocalizedEntity>;
  quantity: number;
  chance: ContentChance;
}
