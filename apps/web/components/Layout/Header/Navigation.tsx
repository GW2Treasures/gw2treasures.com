import type { CSSProperties, FC, ReactNode } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Trans } from '../../I18n/Trans';
import styles from './Navigation.module.css';
import { HorizontalOverflowContainer } from '../HorizontalOverflowContainer';
import type { Language } from '@gw2treasures/database';
import { Composite, CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import type { IconColor, IconProp } from '@gw2treasures/ui';
import { WizardsVaultNewSeasonBadge } from './WizardsVaultNewSeasonBadge';
import { Festival, getActiveFestival, type FestivalInfo } from 'app/[language]/festival/festivals';
import { BonusEvent, getActiveBonusEvent } from 'app/[language]/bonus-event/bonus-events';
import { Badge } from '@/components/Badge/Badge';

interface NavigationProps {
  language: Language,
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  const festival = getActiveFestival();
  const bonusEvent = getActiveBonusEvent();

  return (
    <HorizontalOverflowContainer>
      <Composite render={<ul className={styles.navigation}/>}>
        {festival && (<FestivalNavigationItem festival={festival}/>)}
        {!festival && bonusEvent?.type === BonusEvent.FractalIncursion && (<NavigationItem href="/incursive-investigation" icon="hand" style={{ color: 'light-dark(#663399, #debeff)' }}><Trans language={language} id="incursive-investigation"/></NavigationItem>)}
        <NavigationItem href="/item" icon="item"><Trans language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/achievement" icon="achievement"><Trans language={language} id="navigation.achievements"/></NavigationItem>
        <NavigationItem href="/wizards-vault" icon="wizards-vault"><Trans language={language} id="navigation.wizardsVault"/><WizardsVaultNewSeasonBadge/></NavigationItem>
        <NavigationItem href="/homestead/nodes" icon="homestead"><Trans language={language} id="navigation.homestead"/></NavigationItem>
        <NavigationItem href="/skins" icon="wardrobe"><Trans language={language} id="navigation.wardrobe"/></NavigationItem>
        {/* <NavigationItem href="/profession" icon="profession"><Trans language={language} id="navigation.professions"/></NavigationItem> */}
        {/* <NavigationItem href="/specialization" icon="specialization"><Trans language={language} id="navigation.specializations"/></NavigationItem> */}
        <NavigationItem href="/professions" icon="profession"><Trans language={language} id="navigation.professions"/></NavigationItem>
        <NavigationItem href="/fractals" icon="fractals"><Trans language={language} id="navigation.instances"/>{bonusEvent?.type === BonusEvent.FractalRush && (<Badge>Fractal Rush</Badge>)}</NavigationItem>
        {bonusEvent?.type === BonusEvent.DungeonRush && (
          <NavigationItem href="/dungeons" icon="story" style={{ color: 'light-dark( #1c5133, #b8ffd6)' }}>Dungeon Rush</NavigationItem>
        )}
        {/* <NavigationItem href="/event-timer" icon="event-boss">Event Timer<Badge>New</Badge></NavigationItem> */}
        {/* <NavigationItem href="/wvw" icon="wvw"><Trans language={language} id="navigation.wvw"/></NavigationItem> */}
        <NavigationItem href="/dev" icon="developer"><Trans language={language} id="navigation.developer"/></NavigationItem>
      </Composite>
    </HorizontalOverflowContainer>
  );
};

interface NavigationItemProps {
  children: ReactNode,
  href: string,
  icon: IconProp,
  iconColor?: IconColor,
  style?: CSSProperties,
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  return (
    <li className={styles.item}>
      <CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>
    </li>
  );
};


export default Navigation;

const FestivalNavigationItem: FC<{ festival: FestivalInfo }> = ({ festival }) => {
  switch(festival.type) {
    case Festival.Wintersday:
      return (<NavigationItem href="/festival/wintersday" icon="gift" style={{ color: 'light-dark( #00838f, #80deea)' }}><Trans id="festival.wintersday"/></NavigationItem>);
    case Festival.LunarNewYear:
      return (<NavigationItem href="/festival/lunar-new-year" icon="lantern" style={{ color: 'light-dark( #db2f22, #f1c702)' }}><Trans id="festival.lunar-new-year"/></NavigationItem>);
    case Festival.SuperAdventureFestival:
      return (<NavigationItem href="/festival/super-adventure" icon="sab" style={{ 'color': 'light-dark( #cd00cd, #00ffff)', '--icon-color': 'light-dark(#000, #fff)' }}><Trans id="festival.super-adventure"/></NavigationItem>);
    case Festival.DragonBash:
      return (<NavigationItem href="/festival/dragon-bash" icon="dragon-bash" style={{ color: 'light-dark( #8a0009, #ff8a92)' }}><Trans id="festival.dragon-bash"/></NavigationItem>);
    case Festival.FourWinds:
      return (<NavigationItem href="/festival/four-winds" icon="four-winds" style={{ color: 'light-dark( #0288d1, #81d4fa)' }}><Trans id="festival.four-winds"/></NavigationItem>);
    case Festival.Halloween:
      return (<NavigationItem href="/festival/halloween" icon="halloween" style={{ color: 'light-dark( #c73000, #ffd08a)' }}><Trans id="festival.halloween"/></NavigationItem>);
    default:
      return null;
  }
};
