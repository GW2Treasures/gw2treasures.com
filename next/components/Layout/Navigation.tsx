import React, { FunctionComponent } from 'react';
import styles from './Navigation.module.css';

interface NavigationProps {
  // TODO: define props
};

const Navigation: FunctionComponent<NavigationProps> = () => {
  return (    
    <ul className={styles.navigation}>
      <li className={styles.item}><a href="/" className={styles.link}>Items</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Achievements</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Skins</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Professions</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Traits</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Specializations</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>Mounts</a></li>
      <li className={styles.item}><a href="/" className={styles.link}>World versus World</a></li>
    </ul>
  );
};

export default Navigation;