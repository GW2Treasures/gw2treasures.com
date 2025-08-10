import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function InstancesLayout({ children }: LayoutProps) {
  return (
    <HeroLayout
      hero={<Headline id="professions"><Trans id="navigation.professions"/> & <Trans id="navigation.skills"/></Headline>}
      navBar={(
        <NavBar base="/" items={[
          { segment: 'professions', icon: 'profession', label: <Trans id="navigation.professions"/> },
          { segment: 'skills', icon: 'skill', label: <Trans id="navigation.skills"/> },
        ]}/>
      )}
    >
      <>
        {children}
      </>
    </HeroLayout>
  );
}
