import Link from 'next/link';
import { FC } from 'react';
import { IconName } from '../../icons';
import Icon from '../../icons/Icon';
import styles from './Search.module.css';

export interface PagesProps {
  searchValue: string;
}

const pages: { href: string, title: string, icon?: IconName }[] = [
  { href: '/login', title: 'Login', icon: 'user' },
  { href: '/status/jobs', title: 'Job Status', icon: 'jobs' },
];

export const Pages: FC<PagesProps> = ({ searchValue }) => {
  const results = pages.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()));

  if(results.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.category}>Pages</div>
      {results.map((page) => (
        <Link href={page.href} key={page.href}>
          <a className={styles.result}>
            {page.icon && (<Icon icon={page.icon}/>)}
            <div className={styles.title}>
              {page.title}
            </div>
          </a>
        </Link>
      ))}
    </>
  );
};
