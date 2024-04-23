
import { Icon } from '../../icons';
import type { FC, ReactNode } from 'react';
import styles from './ExternalLink.module.css';

export interface ExternalLinkProps {
  href: string;
  target?: string;
  children: ReactNode;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, target = '_blank', children }) => {
  // the `&#8203;` in combination with `white-space: nowrap` on `.icon` prevents wrapping
  // between the link content and the icon, but still allows wrapping within the content.
  return (
    <a href={href} target={target} rel="noreferrer noopener" className={styles.link}>
      <span className={styles.content}>{children}</span>
      <span className={styles.icon}>&#8203;<Icon icon="external-link"/></span>
    </a>
  );
};
