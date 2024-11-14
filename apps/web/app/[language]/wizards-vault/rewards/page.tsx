import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import { pageView } from '@/lib/pageView';
import { UnknownItem } from '@/components/Item/UnknownItem';
import { PageLayout } from '@/components/Layout/PageLayout';

export default async function WizardsVaultPage() {
  const listings = await db.wizardsVaultListing.findMany({
    where: { removedFromApi: false },
    include: { item: { select: linkProperties }},
    orderBy: { type: 'asc' }
  });

  await pageView('wizards-vault/rewards');

  const Listings = createDataTable(listings, ({ id }) => id);

  return (
    <PageLayout>
      <Listings.Table>
        <Listings.Column id="item" title="Item">{({ item, itemIdRaw, count }) => <OutputCount count={count}>{item ? <ItemLink item={item}/> : <UnknownItem id={itemIdRaw}/>}</OutputCount>}</Listings.Column>
        <Listings.Column id="type" title="Type" sortBy="type">{({ type }) => type}</Listings.Column>
        <Listings.Column id="limit" title="Purchase Limit" sortBy="limit" align="right">{({ limit }) => limit}</Listings.Column>
        <Listings.Column id="cost" title="Cost" align="right" sortBy="cost">{({ cost }) => <AstralAcclaim value={cost}/>}</Listings.Column>
      </Listings.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Wizard\'s Vault'
};
