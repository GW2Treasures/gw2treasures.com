import React, { cloneElement, FunctionComponent, ReactElement, ReactNode } from 'react';
import styles from './DetailLayout.module.css';
import { TableOfContentContext, TableOfContent } from '../TableOfContent/TableOfContent';

interface DetailLayoutProps {
  title: ReactNode;
  icon?: string | ReactElement;
  breadcrumb?: ReactNode;
  children: ReactNode;
  infobox?: ReactNode;
  className?: string;
};

const DetailLayout: FunctionComponent<DetailLayoutProps> = ({ title, icon, breadcrumb, children, infobox, className }) => {
  return (
    <TableOfContentContext>
      <main className={[styles.main, className].filter(Boolean).join(' ')}>
        <div className={infobox ? styles.headline : styles.headlineWithoutInfobox}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {icon && (typeof icon === 'string' ? <img src={icon} alt="" className={styles.icon}/> : cloneElement(icon, { className: styles.icon }))}
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
