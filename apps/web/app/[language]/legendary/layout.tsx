import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { requiredScopes } from './helper';

export default function LegendaryLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="rgb(185 0 185)"
      hero={<Headline id="legendary-armory"><Trans id="legendary-armory"/></Headline>}
      navBar={(
        <NavBar base="/legendary/" items={[
          { segment: 'weapons', icon: 'legendary-weapon', label: <Trans id="legendary-armory.weapons"/> },
          { segment: 'armor', icon: 'legendary-armor', label: <Trans id="legendary-armory.armor"/> },
          { segment: 'trinkets', icon: 'legendary-trinket', label: <Trans id="legendary-armory.trinkets"/> },
          { segment: 'relics', icon: 'legendary-relic', label: <Trans id="legendary-armory.relics"/> },
        ]}/>
      )}
    >
      <>
        <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="legendary-armory.login"/>} authorizationMessage={<Trans id="legendary-armory.authorize"/>}/>
        {children}
      </>
    </HeroLayout>
  );
}
