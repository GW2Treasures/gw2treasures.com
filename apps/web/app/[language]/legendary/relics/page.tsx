import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import type { Achievement } from '@gw2api/types/data/achievement';
import { isDefined } from '@gw2treasures/helper/is';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { Metadata } from 'next';
import { createItemTable, LegendaryItemDataTable } from '../table';

// item id of the legendary relic
const legendaryRelicId = 101582;

// all the achievements are in this category
const rareCollectionsAchievementCategoryId = 75;

// core and SotO relics are always unlocked
const coreAchievementIds = [
  7685, // Relics—Core Set 1
  7686, // Relics—Secrets of the Obscure Set 1
  7684, // Relics—Secrets of the Obscure Set 2
  7960, // Relics—Secrets of the Obscure Set 3
];

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { id: legendaryRelicId },
    select: linkProperties
  });

  return items;
}, ['legendary-relic'], { revalidate: 60 * 60 });

const loadAchievements = cache(async () => {
  const achievements = await db.achievement.findMany({
    where: {
      name_en: { startsWith: 'Relics—%' },
      id: { notIn: coreAchievementIds },
      achievementCategoryId: rareCollectionsAchievementCategoryId
    },
    select: {
      ...linkPropertiesWithoutRarity,
      flags: true,
      prerequisitesIds: true,
      bitsItem: { select: linkProperties },
      current_en: { select: { data: true }},
    },
    orderBy: { id: 'asc' },
  });

  return achievements;
}, ['legendary-relics'], { revalidate: 60 * 60 });

function achievementsToRelics(achievements: Awaited<ReturnType<typeof loadAchievements>>) {
  return achievements.flatMap((achievement) => {
    const data = JSON.parse(achievement.current_en.data) as Achievement;

    return data.bits?.map((bit, index) => {
      if(bit.type !== 'Item') {
        return undefined;
      }

      const item = achievement.bitsItem.find(({ id }) => id === bit.id);

      return item ? { bitId: index, item, achievement } : undefined;
    });
  }).filter(isDefined);
}

export default async function LegendaryRelicsPage() {
  const [items, achievements] = await Promise.all([
    loadItems(),
    loadAchievements(),
  ]);

  const Items = createItemTable(items);
  const Relics = createDataTable(achievementsToRelics(achievements), ({ item }) => item.id);

  return (
    <>
      <Description actions={<ColumnSelect table={Items}/>}>
        <Trans id="legendary-armory.relics.description"/>
      </Description>
      <LegendaryItemDataTable table={Items}/>

      <Headline id="unlocks"><Trans id="legendary-armory.relics.unlocks"/></Headline>
      <p><Trans id="legendary-armory.relics.unlocks.description"/></p>
      <Relics.Table>
        <Relics.Column id="relic" title="Relic">
          {({ item }) => <ItemLink item={item}/>}
        </Relics.Column>
        <Relics.Column id="set" title="Set">
          {({ achievement }) => <AchievementLink achievement={achievement}/>}
        </Relics.Column>
        <Relics.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
          {({ achievement, bitId }) => <AccountAchievementProgressRow achievement={achievement} bitId={bitId}/>}
        </Relics.DynamicColumns>
      </Relics.Table>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('legendary-armory.relics.title'),
    description: t('legendary-armory.relics.description'),
  };
}
