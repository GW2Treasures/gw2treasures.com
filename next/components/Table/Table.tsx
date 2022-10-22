import React, { FunctionComponent } from 'react';
import styles from './Table.module.css';

interface TableProps {
  // TODO: define props
};

const Table: FunctionComponent<TableProps> = ({ children }) => (
  <table className={styles.table}>
    {children}
  </table>
);

export {
  Table
};