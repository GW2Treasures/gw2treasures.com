import React, { FunctionComponent } from 'react';
import { LinkButton } from '../Form/Button';
import { Trans } from '../I18n/Trans';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (
    <ul className={styles.navigation}>
      <li className={styles.item}><LinkButton appearance="menu" href="/item" icon="item"><Trans id="navigation.items"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/achievement" icon="achievement"><Trans id="navigation.achievements"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skin" icon="skin"><Trans id="navigation.skins"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/profession" icon="profession"><Trans id="navigation.professions"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/specialization" icon="specialization"><Trans id="navigation.specializations"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skill" icon="skill"><Trans id="navigation.skills"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/mount" icon="mount"><Trans id="navigation.mounts"/></LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/wvw" icon="wvw"><Trans id="navigation.wvw"/></LinkButton></li>
    </ul>
  );
};

export default Navigation;
