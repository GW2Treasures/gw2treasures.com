import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function InstancesLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#397aa1"
      hero={<Headline id="instances">Instances</Headline>}
      navBar={(
        <NavBar base="/" items={[
          { segment: 'fractals', icon: 'fractals', label: <Trans id="fractals"/> },
          { segment: 'dungeons', icon: 'dungeon', label: <Trans id="dungeons"/> },
        ]}/>
      )}
    >
      <>
        {children}
      </>
    </HeroLayout>
  );
}

