import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (    
    <ul className={styles.navigation}>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Items</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Achievements</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Skins</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Professions</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Traits</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Specializations</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>Mounts</a></Link></li>
      <li className={styles.item}><Link href="/"><a className={styles.link}>World versus World</a></Link></li>
    </ul>
  );
};

export default Navigation;
