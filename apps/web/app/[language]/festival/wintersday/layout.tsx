import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Snow } from 'app/[language]/(home)/snow';
import type { Metadata } from 'next';

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

  return {
    title: {
      template: `${translate('festival.wintersday', language)}: %s · gw2treasures.com`,
      default: ''
    }
  };
}
