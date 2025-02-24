import { Badge } from '@/components/Badge/Badge';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Suspense, type FC } from 'react';


const getWizardsVaultSeasonStartDate = cache(async function getWizardsVaultSeasonStartDate(): Promise<Date | undefined> {
  const now = new Date();
  const season = await db.wizardsVaultSeason.findFirst({
    where: { start: { lte: now }, end: { gt: now }},
    select: { start: true }
  });

  return season?.start;
}, ['wizards-vault-season-start-date'], { revalidate: 60 * 60 });

async function isNewWizardsVaultSeason() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const start = await getWizardsVaultSeasonStartDate();

  return start && (start > oneWeekAgo);
}

export const WizardsVaultNewSeasonBadge: FC = () => (
  <Suspense>
    <WizardsVaultNewSeasonBadgeInternal/>
  </Suspense>
);

const WizardsVaultNewSeasonBadgeInternal: FC = async () => {
  const isNewSeason = await isNewWizardsVaultSeason();

  return isNewSeason
    ? (<Badge color="var(--color-rarity-exotic)">New Season</Badge>)
    : null;
};
