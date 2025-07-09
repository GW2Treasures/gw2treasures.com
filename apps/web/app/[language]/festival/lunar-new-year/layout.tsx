import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { LunarNewYearHero } from './hero';
import type { Metadata } from 'next';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { Badge } from '@/components/Badge/Badge';

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
          { segment: 'drops', label: <><Trans id="festival.drops"/><Badge>NEW</Badge></> },
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

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: {
      template: `${t('festival.lunar-new-year')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.lunar-new-year.description'),
    keywords: ['lunar new year', 'gw2', 'guild wars 2', 'festival', 'dragon ball', 'firecracker', 'firework', 'celestial challenge', 'lucky envelope', 'gold', 'coin', 'luck', 'mini', 'achievement', 'skin', 'unlock'],
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
