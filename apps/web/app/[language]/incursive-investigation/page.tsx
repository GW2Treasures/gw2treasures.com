import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { AchievementTable } from '@/components/Achievement/AchievementTable';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Gw2AccountBodyCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { CountDown, type Schedule } from '@/components/Time/countdown';
import { Waypoint } from '@/components/Waypoint/Waypoint';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Scope } from '@gw2me/client';
import { groupById } from '@gw2treasures/helper/group-by';
import { Icon } from '@gw2treasures/ui';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { DataTableClientColumn, DataTableClientDynamicCell } from '@gw2treasures/ui/components/Table/DataTable.client';
import og from './og.png';
import { ChasingShadowsProgress, FractalIncursionWaypoint, type ScheduledWaypoint } from './page.client';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { WizardsVaultTable } from '@/components/WizardsVault/WizardsVaultTable';
import { Description } from '@/components/Layout/Description';

const bonusEventEndDate = new Date('2025-10-07T19:00:00.000Z');

type WorldBossId =
  // | 'admiral_taidha_covington'
  | 'claw_of_jormag'
  // | 'drakkar'
  | 'fire_elemental'
  | 'great_jungle_wurm'
  // | 'inquest_golem_mark_ii'
  // | 'karka_queen'
  // | 'megadestroyer'
  // | 'mists_and_monsters_titans'
  // | 'modniir_ulgoth'
  | 'shadow_behemoth'
  | 'svanir_shaman_chief'
  | 'tequatl_the_sunless'
  | 'the_shatterer'
  | 'triple_trouble_wurm'
  ;

interface WorldBoss {
  id: WorldBossId,
  achievementId: number,
  bitIndex?: number,
  schedule: Schedule | Schedule[],
  waypointId: number,
}

interface FractalIncursion {
  id: 'fractal_incursion',
  schedule: Schedule | Schedule[],
  waypointId?: undefined,
}

const worldBosses: (WorldBoss | FractalIncursion)[] = [
  // Threats to Tyria 1 (Fire Elemental)
  { achievementId: 8846, bitIndex: 0, schedule: { offset: 45, repeat: 120 }, id: 'fire_elemental', waypointId: 71 },
  // Threats to Tyria 1 (Great Jungle Wurm)
  { achievementId: 8846, bitIndex: 1, schedule: { offset: 75, repeat: 120 }, id: 'great_jungle_wurm', waypointId: 1345 },
  // Threats to Tyria 1 (Shadow Behemoth)
  { achievementId: 8846, bitIndex: 2, schedule: { offset: 105, repeat: 120 }, id: 'shadow_behemoth', waypointId: 247 },
  // Threats to Tyria 1 (Svanir Shaman Chief)
  { achievementId: 8846, bitIndex: 3, schedule: { offset: 15, repeat: 120 }, id: 'svanir_shaman_chief', waypointId: 962 },
  // Threats to Tyria 2 (Claw of Jormag)
  { achievementId: 8847, bitIndex: 0, schedule: { offset: 150, repeat: 180 }, id: 'claw_of_jormag', waypointId: 634 },
  // Threats to Tyria 2 (The Shatterer)
  { achievementId: 8847, bitIndex: 1, schedule: { offset: 60, repeat: 180 }, id: 'the_shatterer', waypointId: 846 },
  // Threats to Tyria 2 (Tequatl the Sunless)
  { achievementId: 8847, bitIndex: 2, schedule: [{ offset: 0 }, { offset: 180 }, { offset: 420 }, { offset: 690 }, { offset: 960 }, { offset: 1140 }], id: 'tequatl_the_sunless', waypointId: 464 },
  // Threats to Tyria 3 (Triple Trouble)
  { achievementId: 8832, schedule: [{ offset: 60 }, { offset: 4 * 60 }, { offset: 8 * 60 }, { offset: 12 * 60 + 30 }, { offset: 17 * 60 }, { offset: 22 * 60 }], id: 'triple_trouble_wurm', waypointId: 426 },
  // Fractal Incursion
  { id: 'fractal_incursion', schedule: { offset: 0, repeat: 60 }}
];

const CHASING_SHADOWS_ACHIEVEMENT_IDS = [
  8848, // Chasing Shadows 1
  8821, // Chasing Shadows 2
  8820, // Chasing Shadows 3
];

const FRACTALLINE_DUST_ITEM_ID = 105336;

const getData = cache(async () => {
  const [achievements, fractallineDust, wizardsVaultObjectives] = await Promise.all([
    db.achievement.findMany({
      where: { achievementCategoryId: { in: [461, 462] }},
      include: {
        icon: true,
        rewardsItem: { select: linkProperties },
        rewardsTitle: true,
      }
    }),
    db.item.findUnique({
      where: { id: FRACTALLINE_DUST_ITEM_ID },
      select: linkProperties,
    }),
    db.wizardsVaultObjective.findMany({
      where: { id: { in: [326, 323, 324, 325] }}
    }),
  ]);

  return { achievements, fractallineDust, wizardsVaultObjectives };
}, ['incursive-investigation'], { revalidate: 60 });

const requiredScopes = [Scope.GW2_Account, Scope.GW2_Progression];

export default async function IncursiveInvestigationPage() {
  const language = await getLanguage();
  const now = new Date();

  const { achievements, fractallineDust, wizardsVaultObjectives } = await getData();
  const achievementsById = groupById(achievements);
  const chasingShadowsAchievements = CHASING_SHADOWS_ACHIEVEMENT_IDS.map((id) => achievementsById.get(id)!);

  const timers = createDataTable(worldBosses, ({ id }) => id);

  const t = getTranslate(language);

  const fractalIncursions: ScheduledWaypoint[] = [
    { id: 18, title: t('incursive-investigation.incursion.kessex-hills'), schedule: { offset: 0, repeat: 60 * 4 }},
    { id: 221, title: t('incursive-investigation.incursion.diessa-plateau'), schedule: { offset: 60, repeat: 60 * 4 }},
    { id: 117, title: t('incursive-investigation.incursion.brisban-wildlands'), schedule: { offset: 120, repeat: 60 * 4 }},
    { id: 180, title: t('incursive-investigation.incursion.snowden-drifs'), schedule: { offset: 180, repeat: 60 * 4 }},
  ];

  return (
    <HeroLayout color="#663399" hero={<Headline id="incursive-investigation"><Trans id="incursive-investigation"/></Headline>}>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.achievements.login"/>} authorizationMessage={<Trans id="festival.achievements.authorize"/>}/>

      <p><Trans id="incursive-investigation.description"/></p>

      <Headline id="dust"><ItemLink item={fractallineDust!}/></Headline>
      <p><Trans id="incursive-investigation.dust.description"/></p>

      <Headline id="timer"><Trans id="incursive-investigation.timer"/></Headline>
      <p><Trans id="incursive-investigation.timer.description"/></p>

      <timers.Table initialSortBy="schedule.countdown" initialSortOrder="asc">
        <timers.Column id="event" title={<Trans id="incursive-investigation.event"/>}>
          {({ id }) => <FlexRow><Icon icon={id === 'fractal_incursion' ? 'hand' : 'event-boss'}/><Trans id={id === 'fractal_incursion' ? 'incursive-investigation.incursion' : `worldboss.${id}`}/></FlexRow>}
        </timers.Column>
        <timers.Column id="waypoint" title={<Trans id="incursive-investigation.waypoint"/>}>
          {({ id, waypointId }) => id === 'fractal_incursion'
            ? <FractalIncursionWaypoint waypoints={fractalIncursions}/>
            : <Waypoint id={waypointId} title={<Trans id={`worldboss.${id}.waypoint`}/>}/>
          }
        </timers.Column>
        <timers.DynamicColumns id="schedule" title="Schedule" headers={<DataTableClientColumn id="countdown" sortable align="right"><Trans id="incursive-investigation.timer"/></DataTableClientColumn>}>
          {({ id, schedule }) => (
            <DataTableClientDynamicCell id="countdown">
              <td style={{ whiteSpace: 'nowrap' }} align="right">
                <CountDown schedule={schedule} activeDurationMinutes={id === 'fractal_incursion' ? 1 : 5} active={<strong><Trans id="incursive-investigation.active"/></strong>} highlightNextMinutes={10} sortable/>
              </td>
            </DataTableClientDynamicCell>
          )}
        </timers.DynamicColumns>
        <timers.DynamicColumns id="account" title="Accounts" headers={<AccountAchievementProgressHeader/>}>
          {(event) => event.id === 'fractal_incursion'
            ? <Gw2AccountBodyCells requiredScopes={requiredScopes}><ChasingShadowsProgress achievements={chasingShadowsAchievements} accountId={null as never}/></Gw2AccountBodyCells>
            : achievementsById.has(event.achievementId)
              ? <AccountAchievementProgressRow achievement={achievementsById.get(event.achievementId)!} bitId={event.bitIndex!} type={'objective' as never}/>
              : <Gw2AccountBodyCells requiredScopes={requiredScopes}><td>?</td></Gw2AccountBodyCells>
          }
        </timers.DynamicColumns>
      </timers.Table>

      <AchievementTable achievements={achievements.filter((achievement) => achievement.achievementCategoryId === 461)} language={language} sort>
        {(table, columnSelect) => (
          <>
            <Headline id="achievements" actions={columnSelect}><Trans id="navigation.achievements"/></Headline>
            <p><Trans id="incursive-investigation.achievements.description"/></p>
            {table}
          </>
        )}
      </AchievementTable>

      {bonusEventEndDate > now && (
        <>
          <AchievementTable achievements={achievements.filter((achievement) => achievement.achievementCategoryId === 462)} language={language} sort>
            {(table, columnSelect) => (
              <>
                <Headline id="achievements" actions={[<span key="reset"><Trans id="festival.time-remaining"/> <ResetTimer reset={bonusEventEndDate}/></span>, columnSelect]}><Trans id="incursive-investigation.bonus-event"/></Headline>
                <p><Trans id="incursive-investigation.bonus-event.description"/></p>
                {table}
              </>
            )}
          </AchievementTable>

          <WizardsVaultTable objectives={wizardsVaultObjectives}>
            {(table, columnSelect) => (
              <>
                <Description actions={columnSelect}>
                  <Trans id="incursive-investigation.bonus-event.wizards-vault"/>
                </Description>

                {table}
              </>
            )}
          </WizardsVaultTable>
        </>
      )}
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('incursive-investigation'),
    description: t('incursive-investigation.description'),
    image: og,
  };
});
