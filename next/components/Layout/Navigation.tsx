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
      <li className={styles.item}><Link prefetch={false} href="/item" className={styles.link}><Icon icon="item"/> Items</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/achievement" className={styles.link}><Icon icon="achievement"/> Achievements</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/skin" className={styles.link}><Icon icon="skin"/> Skins</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/profession" className={styles.link}><Icon icon="profession"/> Professions</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/specialization" className={styles.link}><Icon icon="specialization"/> Specializations</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/skill" className={styles.link}><Icon icon="skill"/> Skills</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/mount" className={styles.link}><Icon icon="mount"/> Mounts</Link></li>
      <li className={styles.item}><Link prefetch={false} href="/wvw" className={styles.link}><Icon icon="wvw"/> World versus World</Link></li>
    </ul>
  );
};

export default Navigation;
