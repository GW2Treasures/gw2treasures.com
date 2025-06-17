import { EntityIcon } from '@/components/Entity/EntityIcon';
import { EntityIconMissing } from '@/components/Entity/EntityIconMissing';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { GliderAccountUnlockCell, requiredScopes } from '@/components/Glider/unlock-cell';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { Trans } from '@/components/I18n/Trans';
import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import type { Language } from '@gw2treasures/database';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import type { Metadata } from 'next';

const getGliders = cache((language: Language) => {
  return db.glider.findMany({
    select: {
      id: true,
      name_de: language === 'de',
      name_en: language === 'en',
      name_es: language === 'es',
      name_fr: language === 'fr',
      icon: true,
      unlocks: true,
      unlockedByItems: { select: linkProperties },
    },
    orderBy: { order: 'asc' }
  });
}, ['gliders'], { revalidate: 60 });

export default async function GlidersPage({ params }: PageProps) {
  const { language } = await params;
  const gliders = await getGliders(language);

  const Gliders = createDataTable(gliders, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={Gliders}/>}>
        <Trans id="gliders.description"/>
      </Description>
      <Gliders.Table>
        <Gliders.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden>
          {({ id }) => id}
        </Gliders.Column>
        <Gliders.Column id="name" title={<Trans id="itemTable.column.name"/>} sort={compareLocalizedName(language)}>
          {(glider) => <FlexRow>{glider.icon ? <EntityIcon icon={glider.icon} size={32}/> : <EntityIconMissing size={32}/>} {localizedName(glider, language)}</FlexRow>}
        </Gliders.Column>
        <Gliders.Column id="items" title={<Trans id="navigation.items"/>}>
          {({ unlockedByItems }) => (
            <ItemList singleColumn>
              {unlockedByItems.map((item) => (<li key={item.id}><ItemLink item={item}/></li>))}
            </ItemList>
          )}
        </Gliders.Column>
        <Gliders.Column id="unlocks" title="Unlocks" align="right" small hidden sortBy="unlocks">
          {({ unlocks }) => unlocks && <Tip tip="Data provided by gw2efficiency"><FormatNumber value={Math.round(unlocks * 1000) / 10} unit="%"/></Tip>}
        </Gliders.Column>
        <Gliders.DynamicColumns id="unlock" title={<Trans id="colors.unlocks"/>} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => (
            <Gw2AccountBodyCells requiredScopes={requiredScopes}><GliderAccountUnlockCell gliderId={id} accountId={undefined as never}/></Gw2AccountBodyCells>
          )}
        </Gliders.DynamicColumns>
      </Gliders.Table>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('gliders'),
    description: t('gliders.description'),
  };
}
