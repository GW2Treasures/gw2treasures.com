'use client';

import { type ChangeEventHandler, type FC, Fragment, type KeyboardEventHandler, type ReactElement, useCallback, useRef, useState } from 'react';
import styles from './Search.module.css';
import { useRouter } from 'next/navigation';
import { usePageResults, useSearchApiResults } from './useSearchResults';
import Link from 'next/link';
import { useDebounce } from '@/lib/useDebounce';
import { autoUpdate, offset, size, useClick, useDismiss, useFloating, useFocus, useInteractions, useListNavigation } from '@floating-ui/react';
import { Icon } from '@gw2treasures/ui';

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
    useFocus(context, { visibleOnly: false }),
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
    ...useSearchApiResults(searchValue),
    usePageResults(searchValue),
  ];

  const loading = searchResults.some((result) => result.loading);

  let index = 0;

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
    setOpen(true);
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if(e.key === 'Enter' && activeIndex !== null) {
      const current = listRef.current[activeIndex];

      if(current === null) {
        return;
      }

      current.click();
      e.preventDefault();
    }
  }, [activeIndex]);

  return (
    <form className={styles.search} ref={refs.setReference} {...getReferenceProps()}>
      <Icon icon="search"/>
      {/* <div className={styles.restriciton}>Item</div> */}

      <input
        className={styles.searchInput}
        placeholder="Search (ALT + Q)"
        autoComplete="off"
        spellCheck="false"
        accessKey="q"
        enterKeyHint="search"
        value={value}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}/>

      {loading && (open || searchValue) && <div className={styles.loading}/>}

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
                const render = result.render ?? ((link: ReactElement) => link);

                return render(
                  <Link
                    tabIndex={-1}
                    href={result.href}
                    key={result.href}
                    className={activeIndex === currentIndex ? styles.resultActive : styles.result}
                    id={result.href}
                    target={result.href.startsWith('http') ? '_blank' : undefined}
                    ref={(node) => listRef.current[currentIndex] = node}
                    {...getItemProps({
                      onClick: (e) => !e.defaultPrevented && setOpen(false)
                    })}
                  >
                    {result.icon}
                    <div className={styles.title}>
                      {result.title}
                    </div>
                    {result.subtitle && (
                      <div className={styles.subtitle}>
                        {result.subtitle}
                      </div>
                    )}
                    {result.href.startsWith('http') && <span className={styles.external}><Icon icon="external"/></span>}
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
