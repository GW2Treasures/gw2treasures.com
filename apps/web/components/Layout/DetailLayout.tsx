import React, { cloneElement, FunctionComponent, isValidElement, ReactElement, ReactNode } from 'react';
import styles from './DetailLayout.module.css';
import { TableOfContentContext, TableOfContent } from '@gw2treasures/ui';
import { Icon } from '@gw2treasures/database';
import { EntityIcon, EntityIconType } from '../Entity/EntityIcon';

interface DetailLayoutProps {
  title: ReactNode;
  icon?: Icon | ReactElement | null;
  iconType?: EntityIconType;
  breadcrumb?: ReactNode;
  children: ReactNode;
  infobox?: ReactNode;
  className?: string;
};

const DetailLayout: FunctionComponent<DetailLayoutProps> = ({ title, icon, breadcrumb, children, infobox, className, iconType }) => {
  return (
    <TableOfContentContext>
      <main className={[styles.main, className].filter(Boolean).join(' ')}>
        <div className={infobox ? styles.headline : styles.headlineWithoutInfobox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {icon && typeof icon === 'object' && (isValidElement<any>(icon) ? cloneElement(icon, { className: styles.icon }) : <EntityIcon icon={icon} size={48} className={styles.icon} type={iconType}/>)}
          <h1 className={styles.title}>{title}</h1>
          {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
        </div>
        <aside className={styles.tableOfContent}>
          <TableOfContent/>
        </aside>
        {infobox && (
          <aside className={styles.infobox}>
            {infobox}
          </aside>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </TableOfContentContext>
  );
};

export default DetailLayout;
