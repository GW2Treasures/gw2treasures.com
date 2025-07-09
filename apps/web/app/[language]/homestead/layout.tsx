import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { createMetadata } from '@/lib/metadata';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';

export default function HomesteadLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#397aa1"
      hero={<Headline id="homestead"><Trans id="navigation.homestead"/></Headline>}
      navBar={(
        <NavBar base="/homestead/" items={[
          { segment: 'nodes', icon: 'node', label: <Trans id="homestead.nodes"/> },
          { segment: 'garden-plots', icon: 'garden', label: <Trans id="homestead.garden-plots"/> },
          { segment: 'cats', icon: 'cat', label: <Trans id="homestead.cats"/> },
          { segment: 'decorations', icon: 'decoration', label: <Trans id="homestead.decorations"/> },
          { segment: 'materials', icon: 'refined-material', label: <><Trans id="homestead.materials"/></> },
          { segment: 'glyphs', icon: 'glyph', label: <Trans id="homestead.glyphs"/> },
        ]}/>
      )}
    >
      <>
        {children}
      </>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;

  return {
    title: {
      template: `${translate('navigation.homestead', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
});
