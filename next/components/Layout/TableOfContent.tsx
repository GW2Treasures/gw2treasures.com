import React, { FunctionComponent } from 'react';
import styles from './TableOfContent.module.css';

interface TableOfContentProps {
  items: {
    id: string,
    label: string,
  }[]
  activeId: string
};

const TableOfContent: FunctionComponent<TableOfContentProps> = ({ items, activeId }) => {
  return (
    <ol className={styles.toc}>
      {items.map(({ id, label }) => (
        <li key={id} className={styles.item}>
          <a href={`#${id}`} className={activeId === id ? styles.activeLink : styles.link}>{label}</a>
        </li>
      ))}
    </ol>
  );
};

export default TableOfContent;