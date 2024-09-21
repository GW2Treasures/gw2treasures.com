import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { ReactNode } from 'react';

export default function HomesteadLayout({ children }: { children: ReactNode }) {
  return (
    <HeroLayout color="#397aa1" hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>}>
      <NavBar base="/homestead/" items={[
        { segment: 'nodes', label: <Trans id="homestead.nodes"/> },
        { segment: 'cats', label: <Trans id="homestead.cats"/> },
        { segment: 'decorations', label: <Trans id="homestead.decorations"/> },
        { segment: 'glyphs', label: <Trans id="homestead.glyphs"/> },
        { segment: 'refinedMaterials', label: <Trans id="homestead.refinedMaterials"/> },
      ]}/>
      <div>
        {children}
      </div>
    </HeroLayout>
  );
}
