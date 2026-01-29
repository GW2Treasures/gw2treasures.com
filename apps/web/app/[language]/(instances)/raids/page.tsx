import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { ItemList } from '@/components/ItemList/ItemList';
import { Description } from '@/components/Layout/Description';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import { parseIcon } from '@/lib/parseIcon';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { raids } from '@gw2treasures/static-data/raids/index';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { RaidClearCell, requiredScopes } from './page.client';
import { pageView } from '@/lib/pageView';
import { createMetadata } from '@/lib/metadata';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

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

export default async function RaidsPage() {
  const { achievements, achievementCategories } = await getRaidAchievements();
  await pageView('/raids');

  const emboldenedWing = getEmboldenedIndex() + 1;
  let wingNumber = 0;

  return (
    <>
      <Notice>
        The Guild Wars 2 Visions of Eternity <b>Quarterly Release 1</b> on <b>Feb 3rd</b> will include a <b>new Raid Encounter</b> and <b>unify Strikes and Raids</b>. It might take some time to update this page accordingly.
      </Notice>
      <Description actions={<span style={{ lineHeight: '36px' }}>Reset: <ResetTimer reset="current-weekly"/></span>}>
        <Trans id="raids.description"/>
      </Description>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small align="right">#</Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.name"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.weekly"/></Table.HeaderCell>
            <Table.HeaderCell><Trans id="raids.encounter"/></Table.HeaderCell>
            <Gw2AccountHeaderCells requiredScopes={requiredScopes} noDataTable small/>
          </tr>
        </thead>
        {raids.flatMap((raid) => raid.wings.map((wing) => (
          <tbody key={wing.id}>
            {wing.events.map((event, index) => (
              <tr key={event.id}>
                {index === 0 && (
                  <>
                    <th rowSpan={wing.events.length} align="right">W{++wingNumber}</th>
                    <th rowSpan={wing.events.length}><Trans id={`raids.wing.${wing.id}`}/></th>
                    <td rowSpan={wing.events.length}>
                      <FlexRow>
                        {wingNumber === emboldenedWing && <Tip tip={<Trans id="raids.emboldened"/>}><Icon icon="raid-emboldened"/></Tip>}
                        {wingNumber === ((emboldenedWing % 8) + 1) && <Tip tip={<Trans id="raids.call-of-the-mists"/>}><Icon icon="raid-call-of-the-mists"/></Tip>}
                      </FlexRow>
                    </td>
                  </>
                )}
                <td>
                  <FlexRow>
                    {event.icon && <EntityIcon icon={parseIcon(event.icon)!} size={32}/>}
                    <Trans id={`raids.event.${event.id}`}/>
                  </FlexRow>
                </td>
                <Gw2AccountBodyCells requiredScopes={requiredScopes} noDataTable>
                  <RaidClearCell accountId={null as never} eventId={event.id}/>
                </Gw2AccountBodyCells>
              </tr>
            ))}
          </tbody>
        )))}
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
    keywords: ['raid', 'wing', 'instance', 'PvE', 'group', 'squad', 'weekly', 'emboldened', 'call of the mists', 'clear', 'completion'],
  };
});
