import { FormatNumber } from '@/components/Format/FormatNumber';
import { ItemLink } from '@/components/Item/ItemLink';
import { Description } from '@/components/Layout/Description';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { groupById } from '@gw2treasures/helper/group-by';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { globalColumnRenderer as itemTableColumn } from '@/components/ItemTable/columns';
import { ColumnSelect } from '@/components/Table/ColumnSelect';
import { Trans } from '@/components/I18n/Trans';
import { Icon } from '@gw2treasures/ui';
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import type { Metadata } from 'next';
import ogImage from './2b4a3gw2-gnashblade-bday-bash-1920x1080-2-590x332.jpg';
import { getCurrentUrl } from '@/lib/url';

const endsAt = new Date('2024-12-02T17:00:00.000Z');

const data = [
  { itemId: 79696, materialId: 24350, quantity: 250, purchaseLimit: 1, gemPrice: null },
  { itemId: 92209, materialId: 24356, quantity: 250, purchaseLimit: 1, gemPrice: 500 },
  { itemId: 92203, materialId: 24341, quantity: 250, purchaseLimit: 1, gemPrice: 500 },
  { itemId: 82060, materialId: 24282, quantity: 50, purchaseLimit: 5, gemPrice: null },
  { itemId: 86694, materialId: 24288, quantity: 50, purchaseLimit: 5, gemPrice: null },
  { itemId: 19980, materialId: 24357, quantity: 50, purchaseLimit: 3, gemPrice: 87 },
];

const loadItems = cache(async function loadItems() {
  const itemIds = data.flatMap(({ itemId, materialId }) => [itemId, materialId]);

  const items = await db.item.findMany({
    where: { id: { in: itemIds }},
    select: {
      ...linkProperties,
      tpTradeable: true, tpCheckedAt: true,
      buyPrice: true, buyQuantity: true,
      sellPrice: true, sellQuantity: true
    },
  });

  return Object.fromEntries(groupById(items).entries());
}, ['evon-gnashblades-birthday']);

export default async function EventPage() {
  const items = await loadItems();
  const Exchange = createDataTable(data, (_, index) => index);

  return (
    <HeroLayout color="#dacaa1" hero={<Headline id="birthday">Evon Gnashblade’s “Birthday” celebration</Headline>}>
      <Description actions={<>Time remaining: <ResetTimer reset={endsAt}/></>}>
        From November 25 to December 2, the Black Lion Vaults will open with exclusive offerings and a chance to trade materials for a few limited-time surprises.
        There will also be new vendors, new displays, and a whole new look to the Vaults, so get ready to head over to Lion’s Arch next week.<br/>
        <ExternalLink href="https://www.guildwars2.com/en/news/celebrate-evon-gnashblades-birthday-with-great-savings-and-improvements-to-the-vaults/">Read more on guildwars2.com</ExternalLink>
      </Description>

      <Headline id="materials" actions={<ColumnSelect table={Exchange}/>}>Material Exchange</Headline>
      <Exchange.Table>
        <Exchange.Column title="Item" id="item">{({ itemId }) => <ItemLink item={items[itemId]}/>}</Exchange.Column>
        <Exchange.Column title="Material" id="material">
          {({ materialId, quantity }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
              <span>
                <span style={{ fontFeatureSettings: '"tnum"', minWidth: '3ch', display: 'inline-block', textAlign: 'right' }}>{quantity}</span>
                {' × '}
              </span>
              <ItemLink item={items[materialId]}/>
            </div>
          )}
        </Exchange.Column>

        <Exchange.Column id="buyPrice" title={<Trans id="itemTable.column.buyPrice"/>} sortBy={({ materialId }) => items[materialId]?.buyPrice} align="right" hidden>
          {({ materialId }) => items[materialId] && itemTableColumn.buyPrice(items[materialId], {})}
        </Exchange.Column>
        <Exchange.Column id="buyQuantity" title={<Trans id="itemTable.column.buyQuantity"/>} sortBy={({ materialId }) => items[materialId]?.buyQuantity} align="right" hidden>
          {({ materialId }) => items[materialId] && itemTableColumn.buyQuantity(items[materialId], {})}
        </Exchange.Column>
        <Exchange.Column id="sellPrice" title={<Trans id="itemTable.column.sellPrice"/>} sortBy={({ materialId }) => items[materialId]?.sellPrice} align="right" hidden>
          {({ materialId }) => items[materialId] && itemTableColumn.sellPrice(items[materialId], {})}
        </Exchange.Column>
        <Exchange.Column id="sellQuantity" title={<Trans id="itemTable.column.sellQuantity"/>} sortBy={({ materialId }) => items[materialId]?.sellQuantity} align="right" hidden>
          {({ materialId }) => items[materialId] && itemTableColumn.sellQuantity(items[materialId], {})}
        </Exchange.Column>

        <Exchange.Column title="Material Buy Price (total)" id="totalBuyPrice" sortBy={({ materialId, quantity }) => items[materialId].buyPrice ? items[materialId].buyPrice * quantity : null} align="right">
          {({ materialId, quantity }) => itemTableColumn.buyPrice({ ...items[materialId], buyPrice: items[materialId].buyPrice ? items[materialId].buyPrice * quantity : null }, {})}
        </Exchange.Column>
        <Exchange.Column title="Material Sell Price (total)" id="totalSellPrice" sortBy={({ materialId, quantity }) => items[materialId].sellPrice ? items[materialId].sellPrice * quantity : null} align="right">
          {({ materialId, quantity }) => itemTableColumn.sellPrice({ ...items[materialId], sellPrice: items[materialId].sellPrice ? items[materialId].sellPrice * quantity : null }, {})}
        </Exchange.Column>

        <Exchange.Column title="Gem Price" id="gemPrice" sortBy="gemPrice" align="right" hidden>
          {({ gemPrice }) => gemPrice ? <FormatNumber value={gemPrice} unit={<Icon icon="gw2t" color="var(--color-focus)"/>}/> : ''}
        </Exchange.Column>

        <Exchange.Column title="Purchase Limit" id="limit" align="right">{({ purchaseLimit }) => <FormatNumber value={purchaseLimit}/>}</Exchange.Column>
      </Exchange.Table>

    </HeroLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Evon Gnashblade’s “Birthday” celebration',
    description: 'From November 25 to December 2, the Black Lion Vaults will open with exclusive offerings and a chance to trade materials for a few limited-time surprises. ' +
      'There will also be new vendors, new displays, and a whole new look to the Vaults, so get ready to head over to Lion’s Arch next week.',
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
