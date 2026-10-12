import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { MasteryColors } from '@/components/Achievement/Mastery';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { Description } from '@/components/Layout/Description';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { cache } from '@/lib/cache';
import { linkProperties, linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { groupById } from '@gw2treasures/helper/group-by';
import { getDayOfYearIndex } from '@gw2treasures/static-data/fractals/index';
import { raidBossCoffers } from '@gw2treasures/static-data/raids/coffer';
import { dailyAchievementId, getDailySet } from '@gw2treasures/static-data/raids/daily';
import { raids, type RaidId } from '@gw2treasures/static-data/raids/index';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Fragment } from 'react';
import { RaidDifficulty } from './difficulty';
import { DailyRaidBountyCell, RaidEncounterClearCell, RaidWingClearCell, requiredScopes } from './page.client';
import styles from './page.module.css';

const alpha = '25';
const RaidCategoryColor: Record<RaidId, string> = {
  core: MasteryColors.Tyria + alpha,
  heart_of_thorns: MasteryColors.Maguuma + alpha,
  path_of_fire: MasteryColors.Desert + alpha,
  icebrood_saga: MasteryColors.Tundra + alpha,
  end_of_dragons: MasteryColors.Jade + alpha,
  secrets_of_the_obscure: MasteryColors.Sky + alpha,
  janthir_wilds: MasteryColors.Wild + alpha,
  visions_of_eternity: MasteryColors.Magic + alpha,
};

function getEmboldenedIndex() {
  const offsetStart = new Date(Date.UTC(2025, 1, 17, 8, 30));

  const millisecondsSince = new Date().valueOf() - offsetStart.valueOf();
  const fullWeeksSince = Math.floor(millisecondsSince / (7 * 24 * 60 * 60 * 1000));

  const index = fullWeeksSince % 8;

  return index;
}

const getRaidAchievements = cache(async () => {
  const [achievementCategories, achievements] = await Promise.all([
    db.achievementCategory.findMany({
      where: { achievementGroupId: '1CAFA333-0C2B-4782-BC4C-7DA30E9CE289', removedFromApi: false },
      select: linkPropertiesWithoutRarity,
      orderBy: { id: 'asc' },
    }),
    db.achievement.findMany({
      where: { id: { in: [2646, 3012, 4035, 4412, 4805] }},
      select: linkPropertiesWithoutRarity,
      orderBy: { id: 'asc' },
    }),
  ]);

  return { achievements, achievementCategories };
}, ['raid-achievement-categories2'], { revalidate: 60 * 60 });

const getRaidItems = cache(async () => {
  const items = await db.item.findMany({
    where: { id: { in: Object.values(raidBossCoffers) }},
    select: linkProperties,
    orderBy: { id: 'asc' },
  });

  return { items };
}, ['raid-items'], { revalidate: 60 * 60 });

export default async function RaidsPage() {
  const language = await getLanguage();
  const translate = getTranslate(language);
  const [{ items }, { achievements, achievementCategories }] = await Promise.all([getRaidItems(), getRaidAchievements()]);
  await pageView('/raids');

  const weeklyWingIndex = getEmboldenedIndex() + 1;
  const raidWingIds = raids.flatMap((r) => r.wings).filter((wing) => wing.type === 'wing').map(({ id }) => id);
  const emboldenedWingId = raidWingIds[weeklyWingIndex - 1];
  const callOfTheMistsWingId = raidWingIds[(weeklyWingIndex % 8)];

  const itemsById = groupById(items);

  const categories = groupById(achievementCategories);

  const dayOfYearIndex = getDayOfYearIndex();
  const dailySet = getDailySet(dayOfYearIndex);

  return (
    <>
      <Description>
        <Trans id="raids.description"/>
      </Description>

      <Headline id="daily" actions={<FlexRow><span><Trans id="reset"/> <ResetTimer reset="current-daily"/></span></FlexRow>}>
        <Trans id="raids.daily"/>
      </Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell><Trans id="raids.name"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.coffer"/></Table.HeaderCell>
            <Gw2AccountHeaderCells requiredScopes={requiredScopes} noDataTable small/>
          </tr>
        </thead>
        <tbody>
          {dailySet.map((raidId) => (
            <tr key={raidId}>
              <td><Trans id={`raids.encounter.${raidId}`}/></td>
              <td>{itemsById.has(raidBossCoffers[raidId]!) ? <ItemLink item={itemsById.get(raidBossCoffers[raidId]!)!}/> : null}</td>
              <Gw2AccountBodyCells requiredScopes={requiredScopes} noDataTable>
                <DailyRaidBountyCell accountId={null} dailyAchievementId={dailyAchievementId[raidId]}/>
              </Gw2AccountBodyCells>
            </tr>
          ))}
        </tbody>
      </Table>

      <Headline id="weekly" actions={<span><Trans id="reset"/> <ResetTimer reset="current-weekly"/></span>}>
        <Trans id="raids.weekly"/>
      </Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell><Trans id="raids.name"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.weekly"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.type"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.difficulty"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.achievements"/></Table.HeaderCell>
            <Gw2AccountHeaderCells requiredScopes={requiredScopes} noDataTable small/>
          </tr>
        </thead>
        <tbody>
          {raids.map((raid) => (
            <Fragment key={raid.id}>
              <tr><th colSpan={99} style={{ '--raid-color': RaidCategoryColor[raid.id] }} className={styles.tableGroup}><Trans id={`raids.category.${raid.id}`}/></th></tr>
              {raid.wings.map((wing) => (
                <tr key={wing.id}>
                  <th><Trans id={wing.type === 'encounter' ? `raids.encounter.${wing.id}` : `raids.wing.${wing.id}`}/></th>
                  <th>
                    <FlexRow>
                      {wing.id === emboldenedWingId && <Tip tip={<Trans id="raids.emboldened"/>}><Icon icon="raid-emboldened"/></Tip>}
                      {wing.id === callOfTheMistsWingId && <Tip tip={<Trans id="raids.call-of-the-mists"/>}><Icon icon="raid-call-of-the-mists"/></Tip>}
                    </FlexRow>
                  </th>
                  <td style={{ color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}><Trans id={`raids.type.${wing.type}`}/></td>
                  <td><RaidDifficulty difficulty={wing.difficulty}/></td>
                  <td>{wing.achievementCategoryId && <AchievementCategoryLink achievementCategory={categories.get(wing.achievementCategoryId)!}/>}</td>
                  <Gw2AccountBodyCells requiredScopes={requiredScopes} noDataTable>
                    {wing.type === 'wing'
                      ? <RaidWingClearCell accountId={null as never} events={wing.events.map((e) => ({ id: e.id, title: translate(`raids.encounter.${e.id}`) }))}/>
                      : <RaidEncounterClearCell accountId={null as never} bitId={wing.bitId}/>
                    }
                  </Gw2AccountBodyCells>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </Table>

      <Headline id="achievements"><Trans id="navigation.achievements"/></Headline>

      <ItemList>
        {achievementCategories.map((category) => <li key={category.id}><AchievementCategoryLink achievementCategory={category}/></li>)}
        {achievements.map((achievement) => <li key={achievement.id}><AchievementLink achievement={achievement}/></li>)}
      </ItemList>
    </>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('raids'),
    description: t('raids.description'),
    keywords: ['raid', 'wing', 'instance', 'PvE', 'group', 'squad', 'weekly', 'daily', 'bounty', 'bounties', 'emboldened', 'call of the mists', 'clear', 'completion', 'coffer'],
  };
});
