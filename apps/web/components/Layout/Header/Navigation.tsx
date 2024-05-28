import type { FC } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { Trans } from '../../I18n/Trans';
import styles from './Navigation.module.css';
import { HorizontalOverflowContainer } from '../HorizontalOverflowContainer';
import type { Language } from '@gw2treasures/database';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <HorizontalOverflowContainer>
      <ul className={styles.navigation}>
        <li className={styles.item}><LinkButton appearance="menu" href="/item" icon="item"><Trans language={language} id="navigation.items"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/achievement" icon="achievement"><Trans language={language} id="navigation.achievements"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/wizards-vault" icon="wizards-vault"><Trans language={language} id="navigation.wizardsVault"/><span className={styles.new}>new</span></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/skin" icon="skin"><Trans language={language} id="navigation.skins"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/profession" icon="profession"><Trans language={language} id="navigation.professions"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/specialization" icon="specialization"><Trans language={language} id="navigation.specializations"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/skill" icon="skill"><Trans language={language} id="navigation.skills"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/mount" icon="mount"><Trans language={language} id="navigation.mounts"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/wvw" icon="wvw"><Trans language={language} id="navigation.wvw"/></LinkButton></li>
        <li className={styles.item}><LinkButton appearance="menu" href="/dev" icon="developer"><Trans language={language} id="navigation.developer"/></LinkButton></li>
      </ul>
    </HorizontalOverflowContainer>
  );
};

export default Navigation;
