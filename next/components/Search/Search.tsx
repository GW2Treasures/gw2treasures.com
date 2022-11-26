import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { useRouter } from 'next/router';
import { useItemResults, usePageResults, useSkillResults, useSkinResults } from './useSearchResults';
import Link from 'next/link';
import { useDebounce } from '../../lib/useDebounce';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [value, setValue] = useState('');
  const searchValue = useDebounce(value);
  const searchForm = useRef<HTMLFormElement>(null);

  const router = useRouter();

  useEffect(() => {
    if(window.document.activeElement && searchForm.current?.contains(window.document.activeElement)) {
      (window.document.activeElement as any).blur();
    }
  }, [router.asPath]);

  const searchResults = [
    useItemResults(searchValue),
    useSkillResults(searchValue),
    useSkinResults(searchValue),
    usePageResults(searchValue),
  ];

  return (
    <form className={styles.search} ref={searchForm}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => setValue(e.target.value)}/>
      <div className={styles.dropdown}>
        {searchResults.map(({ title, results }) => results.length > 0 && (
          <>
            <div className={styles.category}>{title}</div>
            {results.map((result) => (
              <Link href={result.href} key={result.href} className={styles.result}>
                {result.icon}
                <div className={styles.title}>
                  {result.title}
                </div>
                {result.subtitle && (
                  <div className={styles.subtitle}>
                    {result.subtitle}
                  </div>
                )}
              </Link>
            ))}
          </>
        ))}
      </div>
    </form>
  );
};
