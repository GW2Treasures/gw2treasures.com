import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import Icon from '../../icons/Icon';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (
    <ul className={styles.navigation}>
      <li className={styles.item}><Link href="/item"><a className={styles.link}><Icon icon="item"/> Items</a></Link></li>
      <li className={styles.item}><Link href="/achievement"><a className={styles.link}><Icon icon="achievement"/> Achievements</a></Link></li>
      <li className={styles.item}><Link href="/skin"><a className={styles.link}><Icon icon="skin"/> Skins</a></Link></li>
      <li className={styles.item}><Link href="/profession"><a className={styles.link}><Icon icon="profession"/> Professions</a></Link></li>
      <li className={styles.item}><Link href="/specialization"><a className={styles.link}><Icon icon="specialization"/> Specializations</a></Link></li>
      <li className={styles.item}><Link href="/skill"><a className={styles.link}><Icon icon="skill"/> Skills</a></Link></li>
      <li className={styles.item}><Link href="/mount"><a className={styles.link}><Icon icon="mount"/> Mounts</a></Link></li>
      <li className={styles.item}><Link href="/wvw"><a className={styles.link}><Icon icon="wvw"/> World versus World</a></Link></li>
    </ul>
  );
};

export default Navigation;
