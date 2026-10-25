import { Badge } from '@/components/Badge/Badge';
import { Trans } from '@/components/I18n/Trans';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Suspense, type FC } from 'react';


const getWizardsVaultSeasonStartDate = cache(async function getWizardsVaultSeasonStartDate(): Promise<Date | undefined> {
  const now = new Date();
  const season = await db.wizardsVaultSeason.findFirst({
    where: { start: { lte: now }, end: { gt: now }},
    select: { start: true, createdAt: true }
  });

  // TODO: start is broken ()
  // return season?.start;
  return season?.createdAt;
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
    ? (<Badge color="var(--color-rarity-exotic)"><Trans id="wizards-vault.new-season"/></Badge>)
    : null;
};
