import React, { FunctionComponent } from 'react';
import { LinkButton } from '../Form/Button';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (
    <ul className={styles.navigation}>
      <li className={styles.item}><LinkButton appearance="menu" href="/item" icon="item">Items</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/achievement" icon="achievement">Achievements</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skin" icon="skin">Skins</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/profession" icon="profession">Professions</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/specialization" icon="specialization">Specializations</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skill" icon="skill">Skills</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/mount" icon="mount">Mounts</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/wvw" icon="wvw">World versus World</LinkButton></li>
    </ul>
  );
};

export default Navigation;
