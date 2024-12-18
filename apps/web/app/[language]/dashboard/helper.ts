import type { WithIcon } from '@/lib/with';
import type { Currency, Item } from '@gw2treasures/database';
import type { LocalizedEntity } from '@/lib/localizedName';
import { isDefined } from '@gw2treasures/helper/is';

const columnTypeMap = {
  i: 'item',
  c: 'currency',
} as const;

export function encodeColumns(columns: Column[]): string {
  return columns.map(({ type, id }) => `${type[0]}${id}`).join(',');
}

export function decodeColumns(columns: string | string[] | null | undefined): Column[] {
  if(!columns || columns.length === 0) {
    return [];
  }

  return (Array.isArray(columns) ? columns : [columns])
    .flatMap((c) => c.split(','))
    .map(decodeColumn)
    .filter(isDefined);
}

function decodeColumn(column: string): Column | undefined {
  if(column.length < 2) {
    return undefined;
  }

  const type = columnTypeMap[column[0] as keyof typeof columnTypeMap];
  if(!type) {
    return undefined;
  }

  const id = parseInt(column.substring(1));
  if(isNaN(id) || id < 1) {
    return undefined;
  }

  return { type, id };
}

export type Column = {
  id: number;
} & ({
  type: 'item', item?: WithIcon<Pick<Item, 'id' | 'rarity' | keyof LocalizedEntity>>
} | {
  type: 'currency', currency?: WithIcon<Pick<Currency, 'id' | keyof LocalizedEntity>>
});
