import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { SuperAdventureFestivalHero } from './hero';
import type { Metadata } from 'next';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';

export default function SuperAdventureBoxFestivalLayout({ children }: LayoutProps) {
  const festival = getFestival(Festival.SuperAdventureFestival);

  return (
    <HeroLayout color="#25b2f9" hero={(<SuperAdventureFestivalHero><Headline id="super-adventure-box" actions={<FestivalTimer festival={festival}/>}><div style={{ minWidth: '40vw' }}><Trans id="festival.super-adventure"/></div></Headline></SuperAdventureFestivalHero>)}
      skipLayout
      navBar={(
        <NavBar base="/festival/super-adventure/" items={[
          { segment: '(index)', href: '/festival/super-adventure', label: <Trans id="festival.super-adventure"/> },
          { segment: 'box', label: <Trans id="festival.super-adventure.sab"/> },
          { segment: 'achievements', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', label: <Trans id="minis"/> },
          { segment: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(festival) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Super Adventure Festival is currently not active!</Notice>
        </div>
      )}
      {children}
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      template: `${t('festival.super-adventure')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.super-adventure.description'),
    keywords: ['super', 'adventure', 'box', 'gw2', 'treasures', 'gw2treasures', 'guild', 'wars', '2', 'festival', 'event', 'Moto', 'Miya', 'jumping', 'puzzle'],
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
