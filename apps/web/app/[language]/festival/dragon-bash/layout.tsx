import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import type { LayoutProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { DragonBashHero } from './hero';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';

export default function DragonBashFestivalLayout({ children }: LayoutProps) {
  const festival = getFestival(Festival.DragonBash);

  return (
    <HeroLayout hero={(<DragonBashHero><Headline id="dragon-bash" actions={<FestivalTimer festival={festival}/>}><div style={{ minWidth: '40vw' }}><Trans id="festival.dragon-bash"/></div></Headline></DragonBashHero>)}
      skipLayout
      navBar={(
        <NavBar base="/festival/dragon-bash/" items={[
          { segment: '(index)', href: '/festival/dragon-bash', icon: 'dragon-bash', label: <Trans id="festival.dragon-bash"/> },
          { segment: 'achievements', icon: 'achievement', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', icon: 'skin', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', icon: 'mini', label: <Trans id="minis"/> },
          { segment: 'wizards-vault', icon: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(festival) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Dragon Bash festival is currently not active!</Notice>
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
      template: `${t('festival.dragon-bash')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.dragon-bash.description'),
    keywords: ['dragon', 'bash', 'gw2', 'treasures', 'gw2treasures', 'guild', 'wars', '2', 'festival', 'event', 'piñata', 'racing', 'hologram', 'stampede', 'arena', 'adventure'],
    image: ogImage,
  };
});
