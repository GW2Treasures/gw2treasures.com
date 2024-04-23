import { Children, type FC, type ReactElement, type ReactNode } from 'react';
import styles from './Breadcrumb.module.css';
import Link from 'next/link';
import { isTruthy, type Falsy } from '@gw2treasures/helper/is';
import { absoluteUrl } from '@/lib/url';

export interface BreadcrumbProps {
  children: (ReactElement<BreadcrumbItemProps, typeof BreadcrumbItem> | Falsy)[]
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ children }) => {
  return (
    <ol className={styles.crumbs}>
      {Children.map(children, (child) => isTruthy(child) && (
        <li>{child}</li>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': children.filter(isTruthy).map(({ props }, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': props.name,
            'item': props.href ? absoluteUrl(props.href) : undefined
          }))
        })
      }}/>
    </ol>
  );
};

interface BreadcrumbItemProps {
  name: string,
  href?: string,
  children?: ReactNode,
};

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ name, href, children }) => {
  return children ?? (href ? <Link href={href}>{name}</Link> : name);
};

