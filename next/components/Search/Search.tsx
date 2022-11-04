import React, { FC, useDeferredValue, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { useRouter } from 'next/router';
import { Items } from './Items';
import { Pages } from './Pages';
import { Skins } from './Skins';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [value, setValue] = useState('');
  const searchValue = useDeferredValue(value);
  const searchForm = useRef<HTMLFormElement>(null);

  const router = useRouter();

  useEffect(() => {
    if(window.document.activeElement && searchForm.current?.contains(window.document.activeElement)) {
      (window.document.activeElement as any).blur();
    }
  }, [router.asPath]);

  return (
    <form className={styles.search} ref={searchForm}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => setValue(e.target.value)}/>
      <div className={styles.dropdown}>
        <Items searchValue={searchValue}/>
        <Skins searchValue={searchValue}/>
        <Pages searchValue={searchValue}/>
      </div>
    </form>
  );
};
