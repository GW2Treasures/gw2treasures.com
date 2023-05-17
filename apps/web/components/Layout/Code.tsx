import { FC, ReactNode } from 'react';
import styles from './Code.module.css';

interface CodeProps {
  children: ReactNode;
};

export const Code: FC<CodeProps> = ({ children }) => {

  return (
    <pre className={styles.code}>{children}</pre>
  );
};
