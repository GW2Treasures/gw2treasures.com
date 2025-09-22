import { Trans } from '@/components/I18n/Trans';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { NavBar } from '@/components/Layout/NavBar';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import ogImage from './og.png';
import { Festival, getFestival, isFestivalActive } from '../festivals';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { FestivalTimer } from '@/components/Reset/FestivalTimer';
import { createMetadata } from '@/lib/metadata';

export default function HalloweenFestivalLayout({ children }: LayoutProps<'/[language]/festival/halloween'>) {
  const festival = getFestival(Festival.Halloween);

  return (
    <HeroLayout hero={(<Headline id="halloween" actions={<FestivalTimer festival={festival}/>}><div style={{ minWidth: '40vw' }}><Trans id="festival.halloween"/></div></Headline>)}
      skipPreload
      skipLayout
      color="#444"
      navBar={(
        <NavBar base="/festival/halloween/" items={[
          { segment: '(index)', href: '/festival/halloween', icon: 'halloween', label: <Trans id="festival.halloween"/> },
          { segment: 'achievements', icon: 'achievement', label: <Trans id="navigation.achievements"/> },
          { segment: 'skins', icon: 'skin', label: <Trans id="navigation.skins"/> },
          { segment: 'minis', icon: 'mini', label: <Trans id="minis"/> },
          { segment: 'wizards-vault', icon: 'wizards-vault', label: <Trans id="navigation.wizardsVault"/> },
        ]}/>
      )}
    >
      {!isFestivalActive(festival) && (
        <div style={{ margin: '16px 16px -16px' }}>
          <Notice>The Halloween festival is currently not active!</Notice>
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
      template: `${t('festival.halloween')}: %s · gw2treasures.com`,
      default: ''
    },
    description: t('festival.halloween.description'),
    keywords: ['halloween', 'gw2', 'treasures', 'gw2treasures', 'guild wars 2', 'festival', 'event', 'race', 'adventure', 'labyrinth', 'trick or treat', 'farm', 'shadow', 'mad king'],
    image: ogImage,
  };
});
