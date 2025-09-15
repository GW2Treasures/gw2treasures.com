import { Children, type FC, type ReactElement, type ReactNode } from 'react';
import styles from './Breadcrumb.module.css';
import Link from 'next/link';
import { isTruthy, type Falsy } from '@gw2treasures/helper/is';
import { absoluteUrl } from '@/lib/url';
import { StructuredData } from '../StructuredData/StructuredData';
import type { ListItem } from 'schema-dts';

export interface BreadcrumbProps {
  children: (ReactElement<BreadcrumbItemProps, typeof BreadcrumbItem> | Falsy)[],
}

export const Breadcrumb: FC<BreadcrumbProps> = async ({ children }) => {
  return (
    <ol className={styles.crumbs}>
      {Children.map(children, (child) => isTruthy(child) && (
        <li>{child}</li>
      ))}
      <StructuredData data={{
        '@type': 'BreadcrumbList',
        'itemListElement': await Promise.all(children.filter(isTruthy).map(async ({ props: { name, href }}, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          name,
          'item': href ? (await absoluteUrl(href)).toString() : undefined
        } satisfies ListItem)))
      }}/>
    </ol>
  );
};

interface BreadcrumbItemProps {
  name: string,
  href?: string,
  children?: ReactNode,
}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ name, href, children }) => {
  return children ?? (href ? <Link href={href}>{name}</Link> : name);
};

