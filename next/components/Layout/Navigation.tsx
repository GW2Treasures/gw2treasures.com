import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import Icon from '../../icons/Icon';
import { LinkButton } from '../Form/Button';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (
    <ul className={styles.navigation}>
      <li className={styles.item}><LinkButton appearance="menu" href="/item"><Icon icon="item"/> Items</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/achievement"><Icon icon="achievement"/> Achievements</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skin"><Icon icon="skin"/> Skins</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/profession"><Icon icon="profession"/> Professions</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/specialization"><Icon icon="specialization"/> Specializations</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/skill"><Icon icon="skill"/> Skills</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/mount"><Icon icon="mount"/> Mounts</LinkButton></li>
      <li className={styles.item}><LinkButton appearance="menu" href="/wvw"><Icon icon="wvw"/> World versus World</LinkButton></li>
    </ul>
  );
};

export default Navigation;
