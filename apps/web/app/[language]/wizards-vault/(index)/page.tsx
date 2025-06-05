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
import { ItemLink } from '@/components/Item/ItemLink';
import { groupById } from '@gw2treasures/helper/group-by';
import { linkProperties } from '@/lib/linkProperties';

const ITEM_DAILY_CHEST = 99961;
const ITEM_WEEKLY_CHEST = 100137;

const getData = cache(async () => {
  const now = new Date();

  const [season, objectiveWaypoints, items] = await Promise.all([
    db.wizardsVaultSeason.findFirst({
      where: { start: { lte: now }, end: { gt: now }},
    }),

    db.wizardsVaultObjective.findMany({
      where: { waypointId: { not: null }},
      select: { id: true, waypointId: true },
    }).then((waypoints) => waypoints.reduce<Record<number, number>>((map, objective) => ({ ...map, [objective.id]: objective.waypointId! }), {})),

    db.item.findMany({
      where: { id: { in: [ITEM_DAILY_CHEST, ITEM_WEEKLY_CHEST] }},
      select: linkProperties,
    })
  ]);

  return { season, objectiveWaypoints, items };
}, ['wizards-vault-data'], { revalidate: 60 });

export default async function WizardsVaultPage({ params }: PageProps) {
  const { language } = await params;
  const { season, objectiveWaypoints, items } = await getData();

  const itemsById = groupById(items);

  return (
    <PageLayout toc>
      <Headline id="objectives" actions={<LinkButton icon="chevron-right" href="/wizards-vault/objectives" appearance="tertiary">All Objectives</LinkButton>}>{season ? localizedName(season, language) : 'Summary'}</Headline>
      <ErrorBoundary fallback={<Notice type="error">Unknown error</Notice>}>
        <Suspense fallback={<Skeleton/>}>
          <WizardVaultObjectives seasonEnd={season?.end} objectiveWaypoints={objectiveWaypoints}
            dailyChest={<ItemLink item={itemsById.get(ITEM_DAILY_CHEST)!} icon={24}>{null}</ItemLink>}
            weeklyChest={<ItemLink item={itemsById.get(ITEM_WEEKLY_CHEST)!} icon={24}>{null}</ItemLink>}/>
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
