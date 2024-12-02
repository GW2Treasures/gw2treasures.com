import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Snow } from 'app/[language]/festival/wintersday/snow';
import type { Metadata } from 'next';
import ogImage from './og.png';

const endsAt = new Date('2025-01-02T17:00:00.000Z');

export default function WintersdayLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="#7993a9" hero={(<Snow><Headline id="wintersday" actions={<>Time remaining: <ResetTimer reset={endsAt}/></>}>Wintersday</Headline></Snow>)} skipLayout
      navBar={(
        <NavBar base="/festival/wintersday/" items={[
          { segment: '(index)', href: '/festival/wintersday', label: <Trans id="festival.wintersday"/> },
          { segment: 'achievements', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', label: <Trans id="festival.wintersday.minis"/> },
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
      template: `${t('festival.wintersday')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.wintersday.description'),
    keywords: ['wintersday', 'gw2', 'guild wars 2', 'festival', 'tixx', 'Bell Choir', 'snowball', 'toypocalypse', 'winter', 'wonderland', 'lair', 'snowmen', 'gift', 'present', 'orphan'],
    openGraph: {
      images: [{ url: new URL(ogImage.src, await getCurrentUrl()), width: ogImage.width, height: ogImage.height }],
    },
    twitter: { card: 'summary_large_image' }
  };
}