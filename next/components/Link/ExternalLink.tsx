import Icon from 'icons/Icon';
import { FC, ReactNode } from 'react';
import styles from './ExternalLink.module.css';

export interface ExternalLinkProps {
  href: string;
  target?: string;
  children: ReactNode;
}

export const ExternalLink: FC<ExternalLinkProps> = ({ href, target = '_blank', children }) => {
  return <a href={href} target={target} rel="noreferrer noopener" className={styles.link}><span className={styles.content}>{children}</span> <Icon icon="external-link"/></a>;
};
