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
import { UnknownItem } from '@/components/Item/UnknownItem';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export default async function WizardsVaultPage() {
  const [listings, objectiveWaypoints] = await Promise.all([
    db.wizardsVaultListing.findMany({
      where: { removedFromApi: false },
      include: { item: { select: linkProperties }},
      orderBy: { type: 'asc' }
    }),
    db.wizardsVaultObjective.findMany({
      where: { waypointId: { not: null }},
      select: { id: true, waypointId: true }
    }).then((waypoints) => waypoints.reduce<Record<number, number>>((map, objective) => ({ ...map, [objective.id]: objective.waypointId! }), {})),
    pageView('wizards-vault')
  ]);

  const Listings = createDataTable(listings, ({ id }) => id);

  return (
    <HeroLayout hero={<Headline id="wizards-vault">Wizard&apos;s Vault</Headline>} color="#ff9800" toc>
      <Headline id="objectives" actions={<LinkButton icon="chevron-right" href="/wizards-vault/objectives" appearance="tertiary">All Objectives</LinkButton>}>Objectives</Headline>
      <ErrorBoundary fallback={<Notice type="error">Unknown error</Notice>}>
        <Suspense fallback={<Skeleton/>}>
          <WizardVaultObjectives objectiveWaypoints={objectiveWaypoints}/>
        </Suspense>
      </ErrorBoundary>

      <Headline id="rewards">Rewards</Headline>
      <Listings.Table>
        <Listings.Column id="item" title="Item">{({ item, itemIdRaw, count }) => <OutputCount count={count}>{item ? <ItemLink item={item}/> : <UnknownItem id={itemIdRaw}/>}</OutputCount>}</Listings.Column>
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
