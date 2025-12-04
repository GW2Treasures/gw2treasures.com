import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { createLayoutMetadata } from '@/lib/metadata';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function WizardsVaultLayout({ children }: LayoutProps<'/[language]/wizards-vault'>) {
  return (
    <HeroLayout color="#ff9800" skipLayout
      hero={<Headline id="wizardsvault"><Trans id="navigation.wizardsVault"/></Headline>}
      navBar={(
        <NavBar base="/wizards-vault/" items={[
          { segment: '(index)', href: '/wizards-vault', label: <Trans id="wizards-vault.objectives"/>, icon: 'wizards-vault' },
          { segment: 'rewards', label: <Trans id="wizards-vault.rewards"/>, icon: 'wv-rewards' },
        ]}/>
      )}
    >
      {children}
    </HeroLayout>
  );
}

export const generateMetadata = createLayoutMetadata((_, { language }) => {
  return {
    title: {
      template: `${translate('navigation.wizardsVault', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
});
