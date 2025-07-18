import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { LunarNewYearHero } from './hero';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';

export default function LunarNewYearFestivalLayout({ children }: LayoutProps) {
  const lunarNewYear = getFestival(Festival.LunarNewYear);

  return (
    <HeroLayout color="#be3413" hero={(<LunarNewYearHero><Headline id="lunar-new-year" actions={<FestivalTimer festival={lunarNewYear}/>}><div style={{ minWidth: '40vw' }}><Trans id="festival.lunar-new-year"/></div></Headline></LunarNewYearHero>)}
      skipLayout
      navBar={(
        <NavBar base="/festival/lunar-new-year/" items={[
          { segment: '(index)', href: '/festival/lunar-new-year', label: <Trans id="festival.lunar-new-year"/> },
          { segment: 'achievements', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', label: <Trans id="festival.lunar-new-year.minis"/> },
          { segment: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(lunarNewYear) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Lunar New Year festival is currently not active!</Notice>
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
      template: `${t('festival.lunar-new-year')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.lunar-new-year.description'),
    keywords: ['lunar new year', 'gw2', 'guild wars 2', 'festival', 'dragon ball', 'firecracker', 'firework', 'celestial challenge', 'lucky envelope', 'gold', 'coin', 'luck', 'mini', 'achievement', 'skin', 'unlock'],
    image: ogImage,
  };
});
