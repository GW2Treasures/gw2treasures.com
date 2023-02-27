'use client';

import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import Icon from '../../icons/Icon';
import { useRouter } from 'next/navigation';
import { useAchievementResults, useBuildsResults, useItemResults, usePageResults, useSkillResults, useSkinResults } from './useSearchResults';
import Link from 'next/link';
import { useDebounce } from '../../lib/useDebounce';
import { autoUpdate, offset, size, useClick, useDismiss, useFloating, useFocus, useInteractions, useListNavigation } from '@floating-ui/react';

export interface SearchProps {
  // TODO: add props
}

export const Search: FC<SearchProps> = ({ }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const searchValue = useDebounce(value);
  // const searchForm = useRef<HTMLFormElement>(null);
  const listRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const router = useRouter();

  const { refs, context, x, y } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`
          });
        },
        padding: 16
      }),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useFocus(context, { keyboardOnly: false }),
    useClick(context, { toggle: false, keyboardHandlers: false }),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
      scrollItemIntoView: { block: 'nearest', behavior: 'smooth' },
    }),
  ]);

  const searchResults = [
    useItemResults(searchValue),
    useSkillResults(searchValue),
    useSkinResults(searchValue),
    ...useAchievementResults(searchValue),
    usePageResults(searchValue),
    useBuildsResults(searchValue),
  ];

  let index = 0;

  return (
    <form className={styles.search} ref={refs.setReference} {...getReferenceProps()}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}
      <input className={styles.searchInput} placeholder="Search (ALT + Q)" accessKey="q" value={value} onChange={(e) => { setValue(e.target.value); setOpen(true); }} onKeyDown={(e) => {
        if(e.key === 'Enter' && activeIndex !== null) {
          router.push(listRef.current[activeIndex]!.href);
          setOpen(false);
          e.preventDefault();
        }
      }}/>
      {open && (
        <div className={styles.dropdown} ref={refs.setFloating} {...getFloatingProps()} style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
        >
          {searchResults.map(({ title, results, id }) => results.length > 0 && (
            <Fragment key={id}>
              <div className={styles.category}>{title}</div>
              {results.map((result) => {
                const currentIndex = index++;
                return (
                  <Link tabIndex={-1} href={result.href} key={result.href} className={activeIndex === currentIndex ? styles.resultActive : styles.result} id={result.href} ref={(node) => listRef.current[currentIndex] = node} {...getItemProps()} onClick={() => setOpen(false)}>
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
                );
              })}
            </Fragment>
          ))}
        </div>
      )}
    </form>
  );
};
