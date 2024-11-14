import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';

export default function WizardsVaultLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#ff9800" skipLayout
      hero={<Headline id="homestead"><Trans id="navigation.wizardsVault"/></Headline>}
      navBar={(
        <NavBar base="/wizards-vault/" items={[
          { segment: '(index)', href: '/wizards-vault', label: 'Objectives' },
          { segment: 'rewards', label: 'Rewards' },
        ]}/>
      )}
    >
      {children}
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: {
      template: `${translate('navigation.wizardsVault', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
}
