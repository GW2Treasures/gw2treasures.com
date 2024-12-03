import { pageView } from '@/lib/pageView';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ItemTable } from '@/components/ItemTable/ItemTable';
import { extraColumn } from '@/components/ItemTable/columns';
import { WizardsVaultCostColumn, WizardsVaultLimitColumn, WizardsVaultTypeColumn } from './columns';
import { ItemTableContext } from '@/components/ItemTable/ItemTableContext';
import { ItemTableColumnsButton } from '@/components/ItemTable/ItemTableColumnsButton';
import type { TODO } from '@/lib/todo';

export default async function WizardsVaultPage() {
  await pageView('wizards-vault/rewards');

  return (
    <PageLayout>
      <ItemTableContext id="wizardsVaultListing">
        <ItemTableColumnsButton/>
        <ItemTable query={{ model: 'wizardsVaultListing', mapToItem: 'item', where: { removedFromApi: false }}}
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

export const metadata = {
  title: 'Wizard\'s Vault'
};
