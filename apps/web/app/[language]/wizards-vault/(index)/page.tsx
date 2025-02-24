import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { WizardVaultObjectives } from './objectives';
import { ErrorBoundary } from 'react-error-boundary';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { localizedName } from '@/lib/localizedName';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import type { Metadata } from 'next';
import { getAlternateUrls, getCurrentUrl } from '@/lib/url';
import ogImage from './wizards-vault-og.png';

const getData = cache(async () => {
  const now = new Date();

  const season = await db.wizardsVaultSeason.findFirst({
    where: { start: { lte: now }, end: { gt: now }},
  });

  const objectiveWaypoints = await db.wizardsVaultObjective.findMany({
    where: { waypointId: { not: null }},
    select: { id: true, waypointId: true }
  }).then((waypoints) => waypoints.reduce<Record<number, number>>((map, objective) => ({ ...map, [objective.id]: objective.waypointId! }), {}));

  return { season, objectiveWaypoints };
}, ['wizards-vault-data'], { revalidate: 10 });

export default async function WizardsVaultPage({ params }: PageProps) {
  const { language } = await params;
  const { season, objectiveWaypoints } = await getData();

  return (
    <PageLayout toc>
      <Headline id="objectives" actions={<LinkButton icon="chevron-right" href="/wizards-vault/objectives" appearance="tertiary">All Objectives</LinkButton>}>{season ? localizedName(season, language) : 'Summary'}</Headline>
      <ErrorBoundary fallback={<Notice type="error">Unknown error</Notice>}>
        <Suspense fallback={<Skeleton/>}>
          <WizardVaultObjectives seasonEnd={season?.end} objectiveWaypoints={objectiveWaypoints}/>
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = await getTranslate(language);

  return {
    title: t('navigation.wizardsVault'),
    description: t('wizards-vault.description'),
    alternates: getAlternateUrls('/wizards-vault', language),
    keywords: ['wizards vault', 'season', 'rewards', 'objectives', 'reset', 'daily', 'weekly', 'special', 'track', 'PvE', 'PvP', 'WvW', 'AA', 'Astral Acclaim'],
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
