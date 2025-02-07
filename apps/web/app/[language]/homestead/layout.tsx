import { Badge } from '@/components/Badge/Badge';
import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';

export default function HomesteadLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#397aa1"
      hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>}
      navBar={(
        <NavBar base="/homestead/" items={[
          { segment: 'nodes', label: <Trans id="homestead.nodes"/> },
          { segment: 'garden-plots', label: <><Trans id="homestead.garden-plots"/><Badge>New</Badge></> },
          { segment: 'cats', label: <Trans id="homestead.cats"/> },
          { segment: 'decorations', label: <Trans id="homestead.decorations"/> },
          { segment: 'materials', label: <><Trans id="homestead.materials"/></> },
          { segment: 'glyphs', label: <Trans id="homestead.glyphs"/> },
        ]}/>
      )}
    >
      <>
        {children}
      </>
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: {
      template: `${translate('navigation.homestead', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
}
