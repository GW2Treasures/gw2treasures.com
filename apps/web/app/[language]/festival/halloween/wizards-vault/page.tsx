import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { WizardsVaultTable } from '@/components/WizardsVault/WizardsVaultTable';
import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Icon } from '@gw2treasures/ui';
import Link from 'next/link';
import { requiredScopes } from '../helper';

const objectiveIds: number[] = [
  39, // (Festival) Complete the (Annual) Halloween Rituals Achievement
  51, // (Festival) Complete the (Annual) A Royal Tradition Achievement
  106, // (Festival) Complete the (Annual) Raceway Regular Achievement
  191, // (Festival) Complete the (Annual) Masters of the Labyrinth Achievement
];

const loadData = cache(async function loadData() {
  const [objectives] = await Promise.all([
    db.wizardsVaultObjective.findMany({
      where: { id: { in: objectiveIds }}
    })
  ]);

  return { objectives };
}, ['halloween-wizards-vault-objectives'], { revalidate: 60 * 60 });


export default async function HalloweenWizardsVaultPage() {
  const { objectives } = await loadData();
  await pageView('festival/halloween/wizards-vault');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wizards-vault.login"/>} authorizationMessage={<Trans id="festival.wizards-vault.authorize"/>}/>

      <WizardsVaultTable objectives={objectives}>
        {(table, columnSelect) => (
          <>
            <Description actions={columnSelect}>
              <Trans id="festival.halloween.wizards-vault.description"/>
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

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.wizardsVault'),
    description: t('festival.halloween.wizards-vault.description'),
    url: 'festival/halloween/wizards-vault',
  };
});
