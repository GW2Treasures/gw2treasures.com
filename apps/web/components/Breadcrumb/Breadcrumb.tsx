import { Children, type FC, type ReactNode } from 'react';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbProps {
  children: ReactNode[]
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ children }) => {
  return (
    <ol className={styles.crumbs}>
      {Children.map(children, (child, index) => child && (
        <li>{child}</li>
      ))}
    </ol>
  );
};
