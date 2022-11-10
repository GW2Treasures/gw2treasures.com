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

  { href: '/item', title: 'Items', icon: 'item' },
  { href: '/achievement', title: 'Achievements', icon: 'achievement' },
  { href: '/skin', title: 'Skins', icon: 'skin' },
  { href: '/profession', title: 'Professions', icon: 'profession' },
  { href: '/specialization', title: 'Specializations', icon: 'specialization' },
  { href: '/skill', title: 'Skills', icon: 'skill' },
  { href: '/mount', title: 'Mounts', icon: 'mount' },
  { href: '/wvw', title: 'Word vs. World (WvW)', icon: 'wvw' },
];

export const Pages: FC<PagesProps> = ({ searchValue }) => {
  const results = pages.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase())).filter((_, index) => index < 5);

  if(results.length === 0) {
    return null;
  }

  return (
    <>
      <div className={styles.category}>Pages</div>
      {results.map((page) => (
        <Link href={page.href} key={page.href} className={styles.result}>
          {page.icon && (<Icon icon={page.icon}/>)}
          <div className={styles.title}>
            {page.title}
          </div>
        </Link>
      ))}
    </>
  );
};
