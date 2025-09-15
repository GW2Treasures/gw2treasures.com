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
import { Trans } from '@/components/I18n/Trans';
import { getLanguage, getTranslate, translateMany } from '@/lib/translate';
import type { WizardsVaultListingType } from '@gw2treasures/database';

export default async function WizardsVaultPage() {
  await pageView('wizards-vault/rewards');
  const language = await getLanguage();
  const t = getTranslate(language);

  const listingTypeTranslations = translateMany<`wizards-vault.rewards.type.${WizardsVaultListingType}`>([
    'wizards-vault.rewards.type.Featured',
    'wizards-vault.rewards.type.Normal',
    'wizards-vault.rewards.type.Legacy'
  ], language);

  return (
    <PageLayout>
      <ItemTableContext id="wizardsVaultListing">
        <Description actions={<ItemTableColumnsButton/>}>
          <Trans id="wizards-vault.rewards.description"/>
        </Description>
        <ItemTable query={{ model: 'wizardsVaultListing', mapToItem: 'item', where: { removedFromApi: false }, orderBy: [{ type: 'asc' }, { item: { relevancy: 'desc' }}, { itemId: 'asc' }] }}
          pageSize={100}
          extraColumns={[
            extraColumn<'wizardsVaultListing'>({ id: 'listingType', select: { type: true }, title: t('wizards-vault.rewards.type'), component: WizardsVaultTypeColumn as TODO, componentProps: { translations: listingTypeTranslations }, order: 200, orderBy: [{ type: 'asc' }, { type: 'desc' }] }),
            extraColumn<'wizardsVaultListing'>({ id: 'purchaseLimit', select: { limit: true }, title: t('wizards-vault.rewards.limit'), component: WizardsVaultLimitColumn as TODO, order: 201, orderBy: [{ limit: 'asc' }, { limit: 'desc' }], small: true, align: 'right' }),
            extraColumn<'wizardsVaultListing'>({ id: 'astralAcclaim', select: { cost: true }, title: t('wizards-vault.astral-acclaim'), component: WizardsVaultCostColumn as TODO, order: 202, orderBy: [{ cost: 'asc' }, { cost: 'desc' }], small: true, align: 'right' }),
          ]}
          defaultColumns={['item', 'rarity', 'type', 'listingType', 'purchaseLimit', 'astralAcclaim']}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const t = getTranslate(await getLanguage());

  return {
    title: t('wizards-vault.rewards'),
    description: t('wizards-vault.rewards.description')
  };
});
