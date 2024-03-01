import { ItemLink } from '@/components/Item/ItemLink';
import { OutputCount } from '@/components/Item/OutputCount';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { WizardVaultObjectives } from './objectives';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { AstralAcclaim } from '@/components/Format/AstralAcclaim';
import { pageView } from '@/lib/pageView';

export default async function WizardsVaultPage() {
  const [listings] = await Promise.all([
    db.wizardsVaultListing.findMany({ include: { item: { select: linkProperties }}, orderBy: { type: 'asc' }}),
    pageView('wizards-vault')
  ]);

  const Listings = createDataTable(listings, ({ id }) => id);

  return (
    <HeroLayout hero={<Headline id="wizardsvault">Wizard&apos;s Vault</Headline>} color="#ff9800" toc>
      <Headline id="objectives">Objectives</Headline>
      <ErrorBoundary fallback={<Notice type="error">Unknown error</Notice>}>
        <WizardVaultObjectives/>
      </ErrorBoundary>

      <Headline id="rewards">Rewards</Headline>
      <Listings.Table>
        <Listings.Column id="item" title="Item">{({ item, itemIdRaw, count }) => <OutputCount count={count}>{item ? <ItemLink item={item}/> : `Unknown item ${itemIdRaw}`}</OutputCount>}</Listings.Column>
        <Listings.Column id="type" title="Type" sortBy="type">{({ type }) => type}</Listings.Column>
        <Listings.Column id="limit" title="Purchase Limit" sortBy="limit" align="right">{({ limit }) => limit}</Listings.Column>
        <Listings.Column id="cost" title="Cost" align="right" sortBy="cost">{({ cost }) => <AstralAcclaim value={cost}/>}</Listings.Column>
      </Listings.Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Wizard\'s Vault'
};
