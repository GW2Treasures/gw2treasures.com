import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import type { Metadata } from 'next';
import ogImage from './og.png';
import styles from './layout.module.css';

const endsAt = new Date('2025-01-02T17:00:00.000Z');

export default function LunarNewYearFestivalLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#be3413" hero={(<div className={styles.hero}><Headline id="lunar-new-year" actions={<>Time remaining: <ResetTimer reset={endsAt}/></>}><Trans id="festival.lunar-new-year"/></Headline></div>)} skipLayout
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
    keywords: ['lunar-new-year', 'gw2', 'guild wars 2', 'festival', 'tixx', 'Bell Choir', 'snowball', 'toypocalypse', 'winter', 'wonderland', 'lair', 'snowmen', 'gift', 'present', 'orphan'],
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}
