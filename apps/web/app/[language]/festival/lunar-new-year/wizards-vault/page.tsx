import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Metadata } from 'next';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import Link from 'next/link';
import { WizardsVaultObjective } from '@/components/WizardsVault/WizardsVaultObjective';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Icon } from '@gw2treasures/ui';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';

const objectiveIds: number[] = [
  // TODO
];

const loadData = cache(async function loadData() {
  const [objectives] = await Promise.all([
    db.wizardsVaultObjective.findMany({
      where: { id: { in: objectiveIds }}
    })
  ]);

  return { objectives };
}, ['lunar-new-year-wizards-vault-objectives'], { revalidate: 60 * 60 });


export default async function LunarNewYearAchievementsPage({ params }: PageProps) {
  const { language } = await params;
  const { objectives } = await loadData();
  await pageView('festival/lunar-new-year/wizards-vault');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wizards-vault.login"/>} authorizationMessage={<Trans id="festival.wizards-vault.authorize"/>}/>

      <p><Trans id="festival.lunar-new-year.wizards-vault.description"/></p>

      {objectives.length > 0 ? objectives.map((objective) => (
        <WizardsVaultObjective key={objective.id} objective={objective} language={language} disabledLoginNotification/>
      )) : (
        <Notice>No Wizard&apos;s Vault objectives for Lunar New Year are available in the Guild Wars 2 API yet.</Notice>
      )}

      <p style={{ border: '1px solid var(--color-border)', marginTop: 48, padding: 16 }}>
        <Icon icon="wizards-vault"/>{' '}
        Visit the <Link href="/wizards-vault">Wizard&apos;s Vault page</Link> to view all your active Wizard&apos;s Vault objectives.
      </p>

    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.wizardsVault')
  };
}
