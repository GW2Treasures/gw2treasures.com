/* eslint-disable @next/next/no-img-element */
import { Icon } from '@gw2treasures/ui';
import type { FC, ReactNode } from 'react';
import styles from './resource.module.css';

interface FestivalResourceProps {
  children: ReactNode,
  type: 'YouTube' | 'Wiki' | 'Discord' | (string & {}),
  href: string,
  imgSrc: string,
}

export const FestivalResource: FC<FestivalResourceProps> = ({ children, type, href, imgSrc }) => {
  return (
    <a href={href} rel="noreferrer noopener" target="_blank" className={styles.card} data-type={type}>
      <img src={imgSrc} alt="" width={128}/>
      <span className={styles.type}>{type} <Icon icon="external-link"/></span>
      <span className={styles.title}>{children}</span>
    </a>
  );
};

export const FestivalResourceGrid: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.grid}>
      {children}
    </div>
  );
};
