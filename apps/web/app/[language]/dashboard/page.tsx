import type { PageProps } from '@/lib/next';
import { Dashboard } from './dashboard';
import { decodeColumns, type Column } from './helper';
import { db } from '@/lib/prisma';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { groupBy, groupById } from '@gw2treasures/helper/group-by';
import { cache } from 'react';
import { localizedName, type LocalizedEntity } from '@/lib/localizedName';
import { isDefined } from '@gw2treasures/helper/is';
import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';

export default async function DashboardPage({ searchParams }: PageProps) {
  const { columns } = await searchParams;
  const initialColumns = await loadColumns(decodeColumns(columns));

  return (
    <Dashboard initialColumns={initialColumns}/>
  );
}

const loadColumns = cache(async (columns: Column[]): Promise<Column[]> => {
  const columnsByType = groupBy(columns, 'type');

  // load data
  const [items, currencies, achievements] = await Promise.all([
    groupById(await loadItems(columnsByType.get('item')?.map(({ id }) => id))),
    groupById(await loadCurrencies(columnsByType.get('currency')?.map(({ id }) => id))),
    groupById(await loadAchievements(columnsByType.get('achievement')?.map(({ id }) => id))),
  ]);

  return columns.map((column) => {
    switch(column.type) {
      case 'item': return { ...column, item: items.get(column.id) };
      case 'currency': return { ...column, currency: currencies.get(column.id) };
      case 'achievement': return { ...column, achievement: achievements.get(column.id) };
    }
  });
});

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

export const generateMetadata = createMetadata<PageProps>(async ({ searchParams }) => {
  const language = await getLanguage();
  const { columns } = await searchParams;
  const initialColumns = await loadColumns(decodeColumns(columns));

  const columnsToDisplay = 3;
  const displayedColumns = initialColumns.map(getLocalizedEntityFromColumn).filter(isDefined).slice(0, columnsToDisplay).map((entity) => localizedName(entity, language));
  const notDisplayedColumnCount = initialColumns.length - displayedColumns.length;

  return {
    title: initialColumns.length > 0
      ? `Dashboard: ${displayedColumns.join(', ')}${notDisplayedColumnCount > 0 ? `, ${notDisplayedColumnCount} more` : ''}`
      : 'Dashboard',
    description: 'Create your own dashboard to keep track of items, currencies, achievements and more on all your Guild Wars 2 accounts.',

    // only index the page if there are no columns
    robots: columns ? 'noindex' : undefined,
  };
});

function getLocalizedEntityFromColumn(column: Column): LocalizedEntity | undefined {
  switch(column.type) {
    case 'item': return column.item;
    case 'achievement': return column.achievement;
    case 'currency': return column.currency;
  }
}
