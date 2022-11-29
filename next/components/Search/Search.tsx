import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { useRouter } from 'next/router';
import { useBuildsResults, useItemResults, usePageResults, useSkillResults, useSkinResults } from './useSearchResults';
import Link from 'next/link';
import { useDebounce } from '../../lib/useDebounce';
import { autoUpdate, offset, useDismiss, useFloating, useFocus, useInteractions } from '@floating-ui/react-dom-interactions';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const searchValue = useDebounce(value);
  const searchForm = useRef<HTMLFormElement>(null);

  const router = useRouter();

  useEffect(() => {
    if(window.document.activeElement && searchForm.current?.contains(window.document.activeElement)) {
      (window.document.activeElement as any).blur();
    }
  }, [router.asPath]);

  const { x, y, reference, floating, strategy, context, middlewareData, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useFocus(context, { keyboardOnly: false }),
    useDismiss(context),
  ]);

  const searchResults = [
    useItemResults(searchValue),
    useSkillResults(searchValue),
    useSkinResults(searchValue),
    usePageResults(searchValue),
    useBuildsResults(searchValue),
  ];

  return (
    <form className={styles.search} ref={searchForm}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => {setValue(e.target.value); setOpen(true)}} ref={reference} {...getReferenceProps()}/>
      {open && (
        <div className={styles.dropdown} ref={floating} {...getFloatingProps()}>
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
      )}
    </form>
  );
};
