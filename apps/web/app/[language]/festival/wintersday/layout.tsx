import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Snow } from 'app/[language]/festival/wintersday/snow';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';

export default function WintersdayLayout({ children }: LayoutProps) {
  const wintersday = getFestival(Festival.Wintersday);

  return (
    <HeroLayout color="#7993a9" hero={(<Snow><Headline id="wintersday" actions={<FestivalTimer festival={wintersday}/>}><Trans id="festival.wintersday"/></Headline></Snow>)}
      skipLayout
      navBar={(
        <NavBar base="/festival/wintersday/" items={[
          { segment: '(index)', href: '/festival/wintersday', label: <Trans id="festival.wintersday"/> },
          { segment: 'achievements', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', label: <Trans id="festival.wintersday.minis"/> },
          { segment: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(wintersday) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Wintersday festival is currently not active!</Notice>
        </div>
      )}
      <div style={{ margin: '16px 16px -16px' }}>
        <Notice>This page is still showing information for last years Wintersday festival. It will be updated soon.</Notice>
      </div>

      {children}
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: {
      template: `${t('festival.wintersday')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.wintersday.description'),
    keywords: ['wintersday', 'gw2', 'guild wars 2', 'festival', 'tixx', 'Bell Choir', 'snowball', 'toypocalypse', 'winter', 'wonderland', 'lair', 'snowmen', 'gift', 'present', 'orphan'],
    image: ogImage,
  };
});
