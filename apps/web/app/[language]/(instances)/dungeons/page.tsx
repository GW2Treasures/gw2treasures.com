import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkPropertiesWithoutRarity } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { parseIcon } from '@/lib/parseIcon';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { dungeons } from '@gw2treasures/static-data/dungeons/index';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { Metadata } from 'next';
import { DungeonDailyCell, requiredScopes } from './page.client';

const getDungeonFrequenter = cache(
  () => db.achievement.findUnique({ where: { id: 2963 }, select: linkPropertiesWithoutRarity }),
  ['dungeons-frequenter'], { revalidate: 60 * 60 }
);

export default async function DungeonsPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);

  const paths = dungeons.flatMap(({ paths, ...dungeon }) => paths.map((path) => ({ ...path, dungeon })));
  const Paths = createDataTable(paths, ({ id }) => id);

  const dungeonIcons = new Map(dungeons.map(({ id, icon }) => [id, parseIcon(icon)]));

  const dungeonFrequenter = await getDungeonFrequenter();

  return (
    <HeroLayout hero={<Headline id="dungeons">Dungeons</Headline>}>
      <Description actions={<ColumnSelect table={Paths}/>}>
        <Trans id="dungeons.description"/>
      </Description>

      <p>
        Additional rewards can be earned by completing the repeatable <AchievementLink achievement={dungeonFrequenter!} icon={24}/> achievement.
      </p>

      <Paths.Table>
        <Paths.Column id="id" title="Id" hidden small>
          {({ id }) => id}
        </Paths.Column>
        <Paths.Column id="dungeonId" title="Dungeon Id" hidden small>
          {({ dungeon }) => dungeon.id}
        </Paths.Column>
        <Paths.Column id="dungeon" title={<Trans id="dungeon"/>} sortBy={({ dungeon }) => t(`dungeons.${dungeon.id}`)}>
          {({ dungeon }) => <FlexRow><EntityIcon icon={dungeonIcons.get(dungeon.id)!} size={32}/> {t(`dungeons.${dungeon.id}`)}</FlexRow>}
        </Paths.Column>
        <Paths.Column id="path" title={<Trans id="dungeons.path"/>} sortBy={({ id }) => t(`dungeons.path.${id}`)}>
          {({ id }) => t(`dungeons.path.${id}`)}
        </Paths.Column>
        <Paths.Column id="level" title={<Trans id="dungeons.level"/>} align="right">
          {({ level }) => level}
        </Paths.Column>
        <Paths.DynamicColumns id="daily" title={<Trans id="dungeons.daily"/>} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><DungeonDailyCell path={id} accountId={undefined as never}/></Gw2AccountBodyCells> }
        </Paths.DynamicColumns>
      </Paths.Table>
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('dungeons'),
    description: t('dungeons.description'),
  };
}
