import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { linkProperties } from '@/lib/linkProperties';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import type { PageProps } from '@/lib/next';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Trans } from '@/components/I18n/Trans';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { getTranslate } from '@/lib/translate';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { EntityIconMissing } from '@/components/Entity/EntityIconMissing';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { OutfitAccountUnlockCell, requiredScopes } from '@/components/Outfit/unlock-cell';
import { cache } from '@/lib/cache';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { createMetadata } from '@/lib/metadata';

const getOutfits = cache((language: Language) => {
  return db.outfit.findMany({
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
    orderBy: { id: 'asc' }
  });
}, ['outfits'], { revalidate: 60 });

export default async function OutfitsPage({ params }: PageProps) {
  const { language } = await params;
  const outfits = await getOutfits(language);

  const Outfits = createDataTable(outfits, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={Outfits}/>}>
        <Trans id="outfits.description"/>
      </Description>
      <Outfits.Table>
        <Outfits.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden>
          {({ id }) => id}
        </Outfits.Column>
        <Outfits.Column id="name" title={<Trans id="itemTable.column.name"/>} sort={compareLocalizedName(language)}>
          {(outfit) => <FlexRow>{outfit.icon ? <EntityIcon icon={outfit.icon} size={32}/> : <EntityIconMissing size={32}/>} {localizedName(outfit, language)}</FlexRow>}
        </Outfits.Column>
        <Outfits.Column id="items" title={<Trans id="navigation.items"/>}>
          {({ unlockedByItems }) => (
            <ItemList singleColumn>
              {unlockedByItems.map((item) => (<li key={item.id}><ItemLink item={item}/></li>))}
            </ItemList>
          )}
        </Outfits.Column>
        <Outfits.Column id="unlocks" title="Unlocks" align="right" small hidden sortBy="unlocks">
          {({ unlocks }) => unlocks && <Tip tip="Data provided by gw2efficiency"><FormatNumber value={Math.round(unlocks * 1000) / 10} unit="%"/></Tip>}
        </Outfits.Column>
        <Outfits.DynamicColumns id="unlock" title={<Trans id="colors.unlocks"/>} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => (
            <Gw2AccountBodyCells requiredScopes={requiredScopes}><OutfitAccountUnlockCell outfitId={id} accountId={undefined as never}/></Gw2AccountBodyCells>
          )}
        </Outfits.DynamicColumns>
      </Outfits.Table>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('outfits'),
    description: t('outfits.description'),
  };
});
