import type { PageProps } from '@/lib/next';
import { Dashboard } from './dashboard';
import { decodeColumns } from './helper';
import { db } from '@/lib/prisma';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { groupBy, groupById } from '@gw2treasures/helper/group-by';

export default async function DashboardPage({ searchParams }: PageProps) {
  const { columns } = await searchParams;
  const initialColumns = decodeColumns(columns);
  const columnsByType = groupBy(initialColumns, 'type');

  // load data
  const [items, currencies, achievements] = await Promise.all([
    groupById(await loadItems(columnsByType.get('item')?.map(({ id }) => id))),
    groupById(await loadCurrencies(columnsByType.get('currency')?.map(({ id }) => id))),
    groupById(await loadAchievements(columnsByType.get('achievement')?.map(({ id }) => id))),
  ]);

  // append data to initial columns
  for(const column of initialColumns) {
    switch(column.type) {
      case 'item':
        column.item = items.get(column.id);
        break;
      case 'currency':
        column.currency = currencies.get(column.id);
        break;
      case 'achievement':
        column.achievement = achievements.get(column.id);
        break;
    }
  }

  return (
    <Dashboard initialColumns={initialColumns}/>
  );
}

function loadItems(ids: number[] | undefined) {
  if(!ids || ids.length === 0) {
    return [];
  }

  return db.item.findMany({
    where: { id: { in: ids }},
    select: linkProperties
  });
}

function loadCurrencies(ids: number[] | undefined) {
  if(!ids || ids.length === 0) {
    return [];
  }

  return db.currency.findMany({
    where: { id: { in: ids }},
    select: linkPropertiesWithoutRarity
  });
}

function loadAchievements(ids: number[] | undefined) {
  if(!ids || ids.length === 0) {
    return [];
  }

  return db.achievement.findMany({
    where: { id: { in: ids }},
    select: { ...linkPropertiesWithoutRarity, flags: true, prerequisitesIds: true }
  });
}

export const metadata = {
  title: 'Dashboard'
};
