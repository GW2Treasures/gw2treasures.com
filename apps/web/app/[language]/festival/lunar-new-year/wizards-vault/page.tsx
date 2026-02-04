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
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import Link from 'next/link';
import { requiredScopes } from '../helper';

const objectiveIds: number[] = [
  214, // Complete the Annual New Year Customs Achievement
  208, // Open the Final Chest of the Celestial Challenge
  207, // Play a Match in the Dragon Ball Arena
  209, // Complete the Annual Race Event in Divinity's Reach in Under 3 Minutes and 30 Seconds
];

const loadData = cache(async function loadData() {
  const [objectives] = await Promise.all([
    db.wizardsVaultObjective.findMany({
      where: { id: { in: objectiveIds }}
    })
  ]);

  return { objectives };
}, ['lunar-new-year-wizards-vault-objectives'], { revalidate: 60 * 60 });


export default async function LunarNewYearAchievementsPage() {
  const { objectives } = await loadData();
  await pageView('festival/lunar-new-year/wizards-vault');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wizards-vault.login"/>} authorizationMessage={<Trans id="festival.wizards-vault.authorize"/>}/>

      <Notice type="warning">
        The official Guild Wars 2 API currently has a bug and is not providing progress for festival special objectives.
      </Notice>

      <WizardsVaultTable objectives={objectives}>
        {(table, columnSelect) => (
          <>
            <Description actions={columnSelect}>
              <Trans id="festival.lunar-new-year.wizards-vault.description"/>
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
  };
});
