import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';

export default function WardrobeLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#397aa1"
      hero={<Headline id="wardrobe"><Trans id="navigation.wardrobe"/></Headline>}
      navBar={(
        <NavBar base="/" items={[
          { segment: 'skins', icon: 'skin', label: <Trans id="navigation.skins"/> },
          // { segment: 'outfits', icon: 'info', label: <>Outfits <Badge>soon</Badge></> },
          { segment: 'colors', icon: 'color', label: <Trans id="colors"/> },
          // { segment: 'gliders', icon: 'info', label: <>Gliders <Badge>soon</Badge></> },
          // { segment: 'mounts', icon: 'mount', label: <><Trans id="navigation.mounts"/> <Badge>soon</Badge></> },
          // { segment: 'fishing', icon: 'info', label: <>Fishing <Badge>soon</Badge></> },
          // { segment: 'skiffs', icon: 'info', label: <>Skiffs <Badge>soon</Badge></> },
          // { segment: 'novelties', icon: 'info', label: <>Novelties <Badge>soon</Badge></> },
          // { segment: 'jade-bots', icon: 'info', label: <>Jade Bots <Badge>soon</Badge></> },
          { segment: 'minis', icon: 'mini', label: <Trans id="minis"/> },
          // { segment: 'finishers', icon: 'info', label: <>Finishers <Badge>soon</Badge></> },
          // { segment: 'mail-carriers', icon: 'info', label: <>Mail Carriers <Badge>soon</Badge></> },
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
      template: `${translate('navigation.wardrobe', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
}
