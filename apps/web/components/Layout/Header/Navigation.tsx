import type { CSSProperties, FC, ReactNode } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Trans } from '../../I18n/Trans';
import styles from './Navigation.module.css';
import { HorizontalOverflowContainer } from '../HorizontalOverflowContainer';
import type { Language } from '@gw2treasures/database';
import { Composite, CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import type { IconProp } from '@gw2treasures/ui';
import { WizardsVaultNewSeasonBadge } from './WizardsVaultNewSeasonBadge';
import { Festival, getActiveFestival } from 'app/[language]/festival/festivals';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <HorizontalOverflowContainer>
      <Composite render={<ul className={styles.navigation}/>}>
        <FestivalNavigationItem/>
        <NavigationItem href="/item" icon="item"><Trans language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/achievement" icon="achievement"><Trans language={language} id="navigation.achievements"/></NavigationItem>
        <NavigationItem href="/wizards-vault" icon="wizards-vault"><Trans language={language} id="navigation.wizardsVault"/><WizardsVaultNewSeasonBadge/></NavigationItem>
        <NavigationItem href="/homestead/nodes" icon="homestead"><Trans language={language} id="navigation.homestead"/></NavigationItem>
        <NavigationItem href="/skins" icon="wardrobe"><Trans language={language} id="navigation.wardrobe"/></NavigationItem>
        {/* <NavigationItem href="/profession" icon="profession"><Trans language={language} id="navigation.professions"/></NavigationItem> */}
        {/* <NavigationItem href="/specialization" icon="specialization"><Trans language={language} id="navigation.specializations"/></NavigationItem> */}
        <NavigationItem href="/skill" icon="skill"><Trans language={language} id="navigation.skills"/></NavigationItem>
        <NavigationItem href="/fractals" icon="fractals"><Trans language={language} id="navigation.fractals"/></NavigationItem>
        <NavigationItem href="/dungeons" icon="story" style={{ color: 'light-dark(#1c5133, #b8ffd6)'}}>Dungeon Rush</NavigationItem>
        {/* <NavigationItem href="/event-timer" icon="event-boss">Event Timer<Badge>New</Badge></NavigationItem> */}
        {/* <NavigationItem href="/wvw" icon="wvw"><Trans language={language} id="navigation.wvw"/></NavigationItem> */}
        <NavigationItem href="/dev" icon="developer"><Trans language={language} id="navigation.developer"/></NavigationItem>
      </Composite>
    </HorizontalOverflowContainer>
  );
};

interface NavigationItemProps {
  children: ReactNode;
  href: string;
  icon: IconProp;
  style?: CSSProperties;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  return (
    <li className={styles.item}>
      <CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>
    </li>
  );
};


export default Navigation;

const FestivalNavigationItem: FC = () => {
  switch(getActiveFestival()?.type) {
    case Festival.Wintersday:
      return (<NavigationItem href="/festival/wintersday" icon="gift" style={{ color: 'light-dark(#00838f, #80deea)' }}><Trans id="festival.wintersday"/></NavigationItem>);
    case Festival.LunarNewYear:
      return (<NavigationItem href="/festival/lunar-new-year" icon="lantern" style={{ color: 'light-dark(#db2f22, #f1c702)' }}><Trans id="festival.lunar-new-year"/></NavigationItem>);
    default:
      return null;
  }
};
