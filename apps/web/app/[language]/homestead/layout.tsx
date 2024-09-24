import { Badge } from '@/components/Badge/Badge';
import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { PageProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export default function HomesteadLayout({ children }: { children: ReactNode }) {
  return (
    <HeroLayout color="#397aa1" hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>}>
      <NavBar base="/homestead/" items={[
        { segment: 'nodes', label: <Trans id="homestead.nodes"/> },
        { segment: 'cats', label: <Trans id="homestead.cats"/> },
        { segment: 'decorations', label: <Trans id="homestead.decorations"/> },
        { segment: 'materials', label: <><Trans id="homestead.materials"/><Badge>New</Badge></> },
        { segment: 'glyphs', label: <Trans id="homestead.glyphs"/> },
      ]}/>
      <div>
        {children}
      </div>
    </HeroLayout>
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: {
      template: `${translate('navigation.homestead', params.language)}: %s`,
      default: ''
    }
  };
}
