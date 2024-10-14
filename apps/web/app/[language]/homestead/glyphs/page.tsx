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
import { translateMany, translate } from '@/lib/translate';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Description } from '@/components/Layout/Description';
import { isTruthy } from '@gw2treasures/helper/is';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import type { PageProps } from '@/lib/next';
import type { Metadata } from 'next';
import { getAlternateUrls } from '@/lib/url';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Scope } from '@gw2me/client';

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
      sellPrice: true, sellQuantity: true
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
  ]);

  return (
    <>
      <Gw2Accounts requiredScopes={[Scope.GW2_Progression, Scope.GW2_Unlocks]} authorizationMessage="Authorize gw2treasures.com to view your homestead progression." loading={null}/>

      <Description actions={<ColumnSelect table={Glyphs}/>}>
        <Trans id="homestead.glyphs.description"/>
      </Description>

      <Glyphs.Table>
        <Glyphs.Column id="name" title="Glyph" sortBy={({ item }) => item ? localizedName(item, language) : ''}>{({ item, itemIdRaw }) => item ? <ItemLink item={item}/> : <UnknownItem id={itemIdRaw}/>}</Glyphs.Column>
        <Glyphs.Column id="buyPrice" title="Buy Price" sortBy={({ unusedGlyph }) => unusedGlyph?.buyPrice} align="right">{({ unusedGlyph }) => unusedGlyph && itemTableColumn.buyPrice(unusedGlyph, {})}</Glyphs.Column>
        <Glyphs.Column id="buyQuantity" title="Buy Quantity" sortBy={({ unusedGlyph }) => unusedGlyph?.buyQuantity} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.buyQuantity(unusedGlyph, {})}</Glyphs.Column>
        <Glyphs.Column id="sellPrice" title="Sell Price" sortBy={({ unusedGlyph }) => unusedGlyph?.sellPrice} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.sellPrice(unusedGlyph, {})}</Glyphs.Column>
        <Glyphs.Column id="sellQuantity" title="Buy Quantity" sortBy={({ unusedGlyph }) => unusedGlyph?.sellQuantity} align="right" hidden>{({ unusedGlyph }) => unusedGlyph && itemTableColumn.sellQuantity(unusedGlyph, {})}</Glyphs.Column>
        <Glyphs.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small colSpan={3}/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomesteadGlyphsCell glyphIdPrefix={id.split('_')[0]} accountId={undefined as never} slotTranslations={glyphSlotTranslations}/></Gw2AccountBodyCells>}
        </Glyphs.DynamicColumns>
      </Glyphs.Table>

      <PageView page="homestead/glyphs"/>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: translate('homestead.glyphs', language),
    description: translate('homestead.glyphs.description', language),
    alternates: getAlternateUrls('/homestead/glyphs', language)
  };
}
