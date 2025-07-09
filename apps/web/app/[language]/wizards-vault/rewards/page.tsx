import { ItemTable } from '@/components/ItemTable/ItemTable';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { extraColumn } from '@/components/ItemTable/columns';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { pageView } from '@/lib/pageView';
import type { TODO } from '@/lib/todo';
import { WizardsVaultCostColumn, WizardsVaultLimitColumn, WizardsVaultTypeColumn } from './columns';
import { createMetadata } from '@/lib/metadata';

export default async function WizardsVaultPage() {
  await pageView('wizards-vault/rewards');

  return (
    <PageLayout>
      <ItemTableContext id="wizardsVaultListing">
        <Description actions={<ItemTableColumnsButton/>}>
          These items are currently available in the Wizard&apos;s Vault.
        </Description>
        <ItemTable query={{ model: 'wizardsVaultListing', mapToItem: 'item', where: { removedFromApi: false }, orderBy: [{ type: 'asc' }, { item: { relevancy: 'desc' }}, { itemId: 'asc' }] }}
          pageSize={100}
          extraColumns={[
            extraColumn<'wizardsVaultListing'>({ id: 'listingType', select: { type: true }, title: 'Listing Type', component: WizardsVaultTypeColumn as TODO, order: 200, orderBy: [{ type: 'asc' }, { type: 'desc' }] }),
            extraColumn<'wizardsVaultListing'>({ id: 'purchaseLimit', select: { limit: true }, title: 'Purchase Limit', component: WizardsVaultLimitColumn as TODO, order: 201, orderBy: [{ limit: 'asc' }, { limit: 'desc' }], small: true, align: 'right' }),
            extraColumn<'wizardsVaultListing'>({ id: 'astralAcclaim', select: { cost: true }, title: 'Astral Acclaim', component: WizardsVaultCostColumn as TODO, order: 202, orderBy: [{ cost: 'asc' }, { cost: 'desc' }], small: true, align: 'right' }),
          ]}
          defaultColumns={['item', 'rarity', 'type', 'listingType', 'purchaseLimit', 'astralAcclaim']}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Rewards'
});
