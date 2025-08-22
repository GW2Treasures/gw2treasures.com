import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import Link from 'next/link';
import { WizardsVaultObjective } from '@/components/WizardsVault/WizardsVaultObjective';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Icon } from '@gw2treasures/ui';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { createMetadata } from '@/lib/metadata';

const objectiveIds: number[] = [
  223, // (Festival) Complete the (Annual) Festival Automaton Achievement
  224, // (Festival) Complete the (Annual) Some Disassembly Required Achievement
  215, // (Festival) Complete the (Annual) Wintersday Traditions Achievement
  219, // (Festival) Complete the Secret Lair of the Snowmen Strike Mission
];

const loadData = cache(async function loadData() {
  const [objectives] = await Promise.all([
    db.wizardsVaultObjective.findMany({
      where: { id: { in: objectiveIds }}
    })
  ]);

  return { objectives };
}, ['wintersday-wizards-vault-objectives'], { revalidate: 60 * 60 });


export default async function WintersdayAchievementsPage() {
  const language = await getLanguage();
  const { objectives } = await loadData();
  await pageView('festival/wintersday/wizards-vault');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wizards-vault.login"/>} authorizationMessage={<Trans id="festival.wizards-vault.authorize"/>}/>

      <p><Trans id="festival.wintersday.wizards-vault.description"/></p>

      {objectives.length > 0 ? objectives.map((objective) => (
        <WizardsVaultObjective key={objective.id} objective={objective} language={language} disabledLoginNotification/>
      )) : (
        <Notice>No Wizard&apos;s Vault objectives for wintersday are available in the Guild Wars 2 API yet.</Notice>
      )}

      <p style={{ border: '1px solid var(--color-border)', marginTop: 48, padding: 16 }}>
        <Icon icon="wizards-vault"/>{' '}
        Visit the <Link href="/wizards-vault">Wizard&apos;s Vault page</Link> to view all your active Wizard&apos;s Vault objectives.
      </p>

    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.wizardsVault'),
  };
});
