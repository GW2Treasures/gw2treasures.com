import { Trans } from '@/components/I18n/Trans';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { ItemLink } from '@/components/Item/ItemLink';
import { cache } from '@/lib/cache';
import { Gw2AccountBodyCells, Gw2AccountHeaderCells } from '@/components/Gw2Api/Gw2AccountTableCells';
import { AccountHomesteadGlyphsCell, requiredScopes } from '../homestead.client';
import { PageView } from '@/components/PageView/PageView';
import type { Language } from '@gw2treasures/database';
import { localizedName } from '@/lib/localizedName';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { translateMany } from '@/lib/translate';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Description } from '@/components/Layout/Description';

const getGlyphs = cache(
  () => db.homesteadGlyph.findMany({
    include: { item: { select: linkProperties }},
    distinct: ['itemIdRaw']
  }),
  ['homestead-glyphs'], { revalidate: 60 }
);

export default async function HomesteadGlyphsPage({ params: { language }}: { params: { language: Language }}) {
  const glyphs = await getGlyphs();

  const Glyphs = createDataTable(glyphs, ({ id }) => id);

  const glyphSlotTranslations = translateMany([
    'homestead.glyphs.slot.harvesting',
    'homestead.glyphs.slot.logging',
    'homestead.glyphs.slot.mining'
  ]);

  return (
    <>
      <Description actions={<ColumnSelect table={Glyphs}/>}>
        <Trans id="homestead.glyphs.description"/>
      </Description>

      <Glyphs.Table>
        <Glyphs.Column id="name" title="Glyph" sortBy={({ item }) => item ? localizedName(item, language) : ''}>{({ item, itemIdRaw }) => item ? <ItemLink item={item}/> : <UnknownItem id={itemIdRaw}/>}</Glyphs.Column>
        <Glyphs.DynamicColumns headers={<Gw2AccountHeaderCells requiredScopes={requiredScopes} small colSpan={3}/>}>
          {({ id }) => <Gw2AccountBodyCells requiredScopes={requiredScopes}><AccountHomesteadGlyphsCell glyphIdPrefix={id.split('_')[0]} accountId={undefined as never} slotTranslations={glyphSlotTranslations}/></Gw2AccountBodyCells>}
        </Glyphs.DynamicColumns>
      </Glyphs.Table>

      <PageView page="homestead/glyphs"/>
    </>
  );
}

export const metadata = {
  title: 'Homestead Glyphs'
};
