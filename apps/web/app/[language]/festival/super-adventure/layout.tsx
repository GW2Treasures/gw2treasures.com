import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { SuperAdventureFestivalHero } from './hero';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';

export default function SuperAdventureBoxFestivalLayout({ children }: LayoutProps<'/[language]/festival/super-adventure'>) {
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

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: {
      template: `${t('festival.super-adventure')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.super-adventure.description'),
    keywords: ['super', 'adventure', 'box', 'gw2', 'treasures', 'gw2treasures', 'guild', 'wars', '2', 'festival', 'event', 'Moto', 'Miya', 'jumping', 'puzzle'],
    image: ogImage,
  };
});
