import { HeroLayout } from '@/components/Layout/HeroLayout';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import type { Metadata } from 'next';
import { dungeons } from '@gw2treasures/static-data/dungeons/index';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { parseIcon } from '@/lib/parseIcon';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';

export default async function DungeonsPage({ params }: PageProps) {
  const { language } = await params;
  const t = getTranslate(language);

  const paths = dungeons.flatMap(({ paths, ...dungeon }) => paths.map((path) => ({ ...path, dungeon })));
  const Paths = createDataTable(paths, ({ id }) => id);

  const dungeonIcons = new Map(dungeons.map(({ id, icon }) => [id, parseIcon(icon)]));

  return (
    <HeroLayout hero={<Headline id="dungeons">Dungeons</Headline>}>
      <Description actions={<ColumnSelect table={Paths}/>}>
        <Trans id="dungeons.description"/>
      </Description>

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
