import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
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
import { Icon } from '@gw2treasures/ui';
import { DropDown } from '@gw2treasures/ui/components/DropDown/DropDown';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CopyButton } from '@gw2treasures/ui/components/Form/Buttons/CopyButton';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { encode } from 'gw2e-chat-codes';
import type { Metadata } from 'next';
import { requiredScopes, type RelicSet } from '../helper';
import { createItemTable, LegendaryItemDataTable } from '../table';
import { RelicUnlockCell } from './page.client';

// item id of the legendary relic
const legendaryRelicId = 101582;

// all the achievements are in this category
const rareCollectionsAchievementCategoryId = 75;

// core relics are always unlocked
// SotO relics are unlocked if the account has access to SotO
// other relics need to be unlocked bit by bit
const knownAchievements: Record<number, RelicSet | undefined> = {
  7685: { order: 1, access: 'Core' }, // Relics—Core Set 1
  7686: { order: 2, access: 'SecretsOfTheObscure' }, // Relics—Secrets of the Obscure Set 1
  7684: { order: 3, access: 'SecretsOfTheObscure' }, // Relics—Secrets of the Obscure Set 2
  7960: { order: 4, access: 'SecretsOfTheObscure' }, // Relics—Secrets of the Obscure Set 3
  8363: { order: 5, access: 'JanthirWilds' }, // Relics—Janthir Wilds Set 1
  8446: { order: 6, access: 'JanthirWilds' }, // Relics—Janthir Wilds Set 2
};

const loadItems = cache(async () => {
  const items = await db.item.findMany({
    where: { id: legendaryRelicId },
    select: { ...linkProperties, legendaryArmoryMaxCount: true }
  });

  return items;
}, ['legendary-relic'], { revalidate: 60 * 60 });

const loadAchievements = cache(async () => {
  const achievements = await db.achievement.findMany({
    where: {
      name_en: { startsWith: 'Relics—%' },
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

    return data.bits?.map((bit, bitId) => {
      if(bit.type !== 'Item') {
        return undefined;
      }

      const set = knownAchievements[achievement.id];
      const item = achievement.bitsItem.find(({ id }) => id === bit.id);

      return item
        ? { bitId, item, achievement, set }
        : undefined;
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

      <Headline id="unlocks" actions={<ColumnSelect table={Relics}/>}>
        <Trans id="legendary-armory.relics.unlocks"/>
      </Headline>
      <p><Trans id="legendary-armory.relics.unlocks.description"/></p>
      <Relics.Table initialSortBy="set">
        <Relics.Column id="id" title={<Trans id="itemTable.column.id"/>} small hidden align="right">{({ item }) => item.id}</Relics.Column>
        <Relics.Column id="relic" title={<Trans id="legendary-armory.relic"/>} fixed>
          {({ item }) => <ItemLink item={item}/>}
        </Relics.Column>
        <Relics.Column id="set" title={<Trans id="legendary-armory.set"/>} sortBy={({ set, achievement }) => set?.order ?? achievement.id}>
          {({ achievement }) => <AchievementLink achievement={achievement}/>}
        </Relics.Column>
        <Relics.DynamicColumns id="account-unlock" title="Account Unlocks" headers={<Gw2AccountHeaderCells small requiredScopes={requiredScopes}/>}>
          {({ achievement, bitId, set }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><RelicUnlockCell achievement={achievement} bitId={bitId} set={set} accountId={undefined as never}/></Gw2AccountBodyCells>}
        </Relics.DynamicColumns>
        <Relics.Column id="actions" title="" small fixed>
          {({ item, achievement }) => (
            <DropDown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
              <MenuList>
                <LinkButton appearance="menu" icon="eye" href={`/item/${item.id}`}>View Item</LinkButton>
                <CopyButton appearance="menu" icon="chatlink" copy={encode('item', item.id) || ''}><Trans id="chatlink.copy"/></CopyButton>
                <LinkButton appearance="menu" icon="external" href={`https://api.guildwars2.com/v2/items/${item.id}?v=latest`} target="_blank" rel="noreferrer noopener">API</LinkButton>
                <Separator/>
                <LinkButton appearance="menu" icon="eye" href={`/achievement/${achievement.id}`}>View Achievement</LinkButton>
                <LinkButton appearance="menu" icon="external" href={`https://api.guildwars2.com/v2/achievements/${achievement.id}?v=latest`} target="_blank" rel="noreferrer noopener">API</LinkButton>
              </MenuList>
            </DropDown>
          )}
        </Relics.Column>
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
