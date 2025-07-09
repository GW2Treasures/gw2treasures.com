import { ItemLink } from '@/components/Item/ItemLink';
import { ItemList } from '@/components/ItemList/ItemList';
import { linkProperties } from '@/lib/linkProperties';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import { db } from '@/lib/prisma';
import type { Language } from '@gw2treasures/database';
import { unstable_cache } from 'next/cache';
import { DyeColor } from '@/components/Color/DyeColor';
import { hexToRgb } from '@/components/Color/hex-to-rgb';
import type { PageProps } from '@/lib/next';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { Description } from '@/components/Layout/Description';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Trans } from '@/components/I18n/Trans';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { ColorAccountUnlockCell, requiredScopes } from '@/components/Color/unlock-cell';
import { getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const getColors = unstable_cache((language: Language) => {
  return db.color.findMany({
    select: {
      id: true,
      name_de: language === 'de',
      name_en: language === 'en',
      name_es: language === 'es',
      name_fr: language === 'fr',
      cloth_rgb: true,
      leather_rgb: true,
      metal_rgb: true,
      unlockedByItems: { select: linkProperties },
    },
    orderBy: { id: 'asc' }
  });
}, ['get-colors']);

export default async function ColorPage({ params }: PageProps) {
  const { language } = await params;
  const colors = await getColors(language);

  const Colors = createDataTable(colors, ({ id }) => id);

  return (
    <>
      <Description actions={<ColumnSelect table={Colors}/>}>
        <Trans id="colors.description"/>
      </Description>
      <Colors.Table>
        <Colors.Column id="id" title={<Trans id="itemTable.column.id"/>} align="right" small hidden>
          {({ id }) => id}
        </Colors.Column>
        <Colors.Column id="name" title={<Trans id="itemTable.column.name"/>} sort={compareLocalizedName(language)}>
          {(name) => localizedName(name, language)}
        </Colors.Column>
        <Colors.Column id="items" title={<Trans id="navigation.items"/>}>
          {({ unlockedByItems }) => (
            <ItemList singleColumn>
              {unlockedByItems.map((item) => (<li key={item.id}><ItemLink item={item}/></li>))}
            </ItemList>
          )}
        </Colors.Column>
        <Colors.Column id="cloth" title={<Trans id="colors.cloth"/>} small>
          {({ cloth_rgb }) => <DyeColor color={hexToRgb(cloth_rgb)}/>}
        </Colors.Column>
        <Colors.Column id="leather" title={<Trans id="colors.leather"/>} small>
          {({ leather_rgb }) => <DyeColor color={hexToRgb(leather_rgb)}/>}
        </Colors.Column>
        <Colors.Column id="metal" title={<Trans id="colors.metal"/>} small>
          {({ metal_rgb }) => <DyeColor color={hexToRgb(metal_rgb)}/>}
        </Colors.Column>
        <Colors.DynamicColumns id="unlock" title={<Trans id="colors.unlocks"/>} headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small/>}>
          {({ id }) => (
            <Gw2AccountBodyCells requiredScopes={requiredScopes}><ColorAccountUnlockCell colorId={id} accountId={undefined as never}/></Gw2AccountBodyCells>
          )}
        </Colors.DynamicColumns>
      </Colors.Table>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('colors'),
  };
});
