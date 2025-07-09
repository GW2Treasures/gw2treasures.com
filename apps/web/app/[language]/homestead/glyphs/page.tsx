import { Trans } from '@/components/I18n/Trans';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { ItemLink } from '@/components/Item/ItemLink';
import { cache } from '@/lib/cache';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountHomesteadGlyphsCell, requiredScopes } from '../homestead.client';
import { PageView } from '@/components/PageView/PageView';
import { localizedName } from '@/lib/localizedName';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { translateMany, getTranslate } from '@/lib/translate';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Description } from '@/components/Layout/Description';
import { isTruthy } from '@gw2treasures/helper/is';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import type { PageProps } from '@/lib/next';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';
import { createMetadata } from '@/lib/metadata';

const getGlyphs = cache(async () => {
  const glyphs = await db.homesteadGlyph.findMany({
    include: { item: { select: linkProperties }},
    distinct: ['itemIdRaw']
  });

  const unusedGlyphNames = glyphs.map(({ item }) => item && `${item.name_en} (Unused)`).filter(isTruthy);

  // try to find the "(Unused)" variant of the glyph
  const unusedGlyphs = await db.item.findMany({
    select: {
      ...linkProperties,
      tpTradeable: true, tpCheckedAt: true,
      buyPrice: true, buyQuantity: true,
      sellPrice: true, sellQuantity: true,
      tpHistory: { orderBy: { time: 'asc' }}
    },
    where: { name_en: { in: unusedGlyphNames }}
  });

  return glyphs.map((glyph) => {
    if(!glyph.item) {
      return { ...glyph, unusedGlyph: undefined };
    }

    const unusedGlyphName = `${glyph.item.name_en} (Unused)`;
    const unusedGlyph = unusedGlyphs.find(({ name_en }) => name_en === unusedGlyphName);

    return { ...glyph, unusedGlyph };
  });
}, ['homestead-glyphs'], { revalidate: 60 });

export default async function HomesteadGlyphsPage({ params }: PageProps) {
  const { language } = await params;
  const glyphs = await getGlyphs();

  const Glyphs = createDataTable(glyphs, ({ id }) => id);

  const glyphSlotTranslations = translateMany([
    'homestead.glyphs.slot.harvesting',
    'homestead.glyphs.slot.logging',
    'homestead.glyphs.slot.mining'
  ], language);

  return (
    <>
      <Gw2Accounts requiredScopes={[Scope.GW2_Progression, Scope.GW2_Unlocks]} authorizationMessage="Authorize gw2treasures.com to view your homestead progression." loading={null}/>

      <Description actions={<ColumnSelect table={Glyphs}/>}>
        <Trans id="homestead.glyphs.description"/>
      </Description>

      <Glyphs.Table>
        <Glyphs.Column id="id" title={<Trans id="itemTable.column.id"/>} sortBy="itemIdRaw" small hidden align="right">{({ itemIdRaw }) => itemIdRaw}</Glyphs.Column>
        <Glyphs.Column id="name" title="Glyph" sortBy={({ item }) => item ? localizedName(item, language) : ''}>{({ item, itemIdRaw }) => item ? <ItemLink item={item}/> : <UnknownItem id={itemIdRaw}/>}</Glyphs.Column>
        <Glyphs.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ unusedGlyph }) => unusedGlyph?.buyPrice} align="right">{({ unusedGlyph }) => unusedGlyph && itemTableColumn.buyPrice(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.Column id="buyPriceTrend" title={<Trans id="itemTable.column.buyPriceTrend"/>} align="right">{({ unusedGlyph }) => unusedGlyph && itemTableColumn.buyPriceTrend(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ unusedGlyph }) => unusedGlyph?.buyQuantity} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.buyQuantity(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ unusedGlyph }) => unusedGlyph?.sellPrice} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.sellPrice(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.Column id="sellPriceTrend" title={<Trans id="itemTable.column.sellPriceTrend"/>} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.sellPriceTrend(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ unusedGlyph }) => unusedGlyph?.sellQuantity} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.sellQuantity(unusedGlyph, {}, language)}</Glyphs.Column>
        <Glyphs.DynamicColumns id="account-slots" title="Account Slots" headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small colSpan={3} sortable={false}/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomesteadGlyphsCell glyphIdPrefix={id.split('_')[0]} accountId={undefined as never} slotTranslations={glyphSlotTranslations}/></Gw2AccountBodyCells>}
        </Glyphs.DynamicColumns>
      </Glyphs.Table>

      <PageView page="homestead/glyphs"/>
    </>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('homestead.glyphs'),
    description: t('homestead.glyphs.description'),
  };
});
