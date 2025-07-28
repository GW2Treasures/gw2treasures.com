import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { WizardsVaultTable } from '@/components/WizardsVault/WizardsVaultTable';
import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { Icon } from '@gw2treasures/ui';
import Link from 'next/link';
import { requiredScopes } from '../helper';

const objectiveIds: number[] = [
  261, // (Festival) Complete the (Annual) Commodities Trader Achievement
  262, // (Festival) Complete the (Annual) Four Winds Customs Achievement
  263, // (Festival) Complete the (Annual) Boss Blitz Achievement
  264, // (Festival) Complete the (Annual) Bundle Plunderer Achievement
];

const loadData = cache(async function loadData() {
  const [objectives] = await Promise.all([
    db.wizardsVaultObjective.findMany({
      where: { id: { in: objectiveIds }}
    })
  ]);

  return { objectives };
}, ['four-winds-wizards-vault-objectives'], { revalidate: 60 * 60 });


export default async function FourWindsWizardsVaultPage() {
  const { objectives } = await loadData();
  await pageView('festival/four-winds/wizards-vault');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wizards-vault.login"/>} authorizationMessage={<Trans id="festival.wizards-vault.authorize"/>}/>

      <WizardsVaultTable objectives={objectives}>
        {(table, columnSelect) => (
          <>
            <Description actions={columnSelect}>
              <Trans id="festival.four-winds.wizards-vault.description"/>
            </Description>

            {table}
          </>
        )}
      </WizardsVaultTable>

      <p style={{ border: '1px solid var(--color-border)', marginTop: 48, padding: 16 }}>
        <Icon icon="wizards-vault"/>{' '}
        Visit the <Link href="/wizards-vault">Wizard&apos;s Vault page</Link> to view all your active Wizard&apos;s Vault objectives.
      </p>

    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.wizardsVault'),
    description: t('festival.four-winds.wizards-vault.description'),
    url: 'festival/four-winds/wizards-vault',
  };
});
