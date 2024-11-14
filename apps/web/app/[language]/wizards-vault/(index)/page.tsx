import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { WizardVaultObjectives } from './objectives';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { PageLayout } from '@/components/Layout/PageLayout';

export default async function WizardsVaultPage() {
  const objectiveWaypoints = await db.wizardsVaultObjective.findMany({
    where: { waypointId: { not: null }},
    select: { id: true, waypointId: true }
  }).then((waypoints) => waypoints.reduce<Record<number, number>>((map, objective) => ({ ...map, [objective.id]: objective.waypointId! }), {}));

  return (
    <PageLayout toc>
      <Headline id="objectives" actions={<LinkButton icon="chevron-right" href="/wizards-vault/objectives" appearance="tertiary">All Objectives</LinkButton>}>Summary</Headline>
      <ErrorBoundary fallback={<Notice type="error">Unknown error</Notice>}>
        <Suspense fallback={<Skeleton/>}>
          <WizardVaultObjectives objectiveWaypoints={objectiveWaypoints}/>
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Wizard\'s Vault'
};
