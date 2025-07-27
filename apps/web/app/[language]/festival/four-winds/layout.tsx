import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';
import { FourWindsHero } from './hero';

export default function FourWindsFestivalLayout({ children }: LayoutProps) {
  const festival = getFestival(Festival.FourWinds);

  return (
    <HeroLayout hero={(<FourWindsHero><Headline id="four-winds" actions={<FestivalTimer festival={festival}/>}><div style={{ minWidth: '40vw' }}><Trans id="festival.four-winds"/></div></Headline></FourWindsHero>)}
      skipLayout color="#81D4FA"
      navBar={(
        <NavBar base="/festival/four-winds/" items={[
          { segment: '(index)', href: '/festival/four-winds', icon: 'four-winds', label: <Trans id="festival.four-winds"/> },
          { segment: 'achievements', icon: 'achievement', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', icon: 'skin', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', icon: 'mini', label: <Trans id="minis"/> },
          { segment: 'wizards-vault', icon: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(festival) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Festival of the Four Winds is currently not active!</Notice>
        </div>
      )}
      {children}
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      template: `${t('festival.four-winds')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.four-winds.description'),
    keywords: ['four winds', 'gw2', 'treasures', 'gw2treasures', 'guild wars 2', 'festival', 'event', 'race', 'adventure', 'Labyrinthine Cliffs', 'Crown Pavilion', 'queens gauntlet', 'aspect arena', 'sanctum sprint'],
    image: ogImage,
  };
});
