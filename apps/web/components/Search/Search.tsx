'use client';

import { type ChangeEventHandler, cloneElement, type ComponentPropsWithoutRef, type ElementType, type FC, Fragment, type KeyboardEventHandler, type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import styles from './Search.module.css';
import { usePageResults, useSearchApiResults } from './useSearchResults';
import Link from 'next/link';
import { useDebounce } from '@/lib/useDebounce';
import { autoUpdate, offset, shift, size, useDismiss, useFloating, useFocus, useInteractions, useListNavigation } from '@floating-ui/react';
import { Icon } from '@gw2treasures/ui';
import type { TranslationSubset } from '@/lib/translate';
import type { translations as itemTypeTranslations } from '../Item/ItemType.translations';
import type { Rarity } from '@gw2treasures/database';
import type { Weight } from '@/lib/types/weight';
import { useSearch } from './use-search';
import { Button, LinkButton } from '@gw2treasures/ui/components/Form/Button';
import type { TODO } from '@/lib/todo';

export interface SearchProps {
  translations: TranslationSubset<
   | 'search.placeholder'
   | 'search.results.items'
   | 'search.results.skills'
   | 'search.results.skins'
   | 'search.results.achievements'
   | 'search.results.achievements.categories'
   | 'search.results.achievements.groups'
   | 'search.results.builds'
   | 'search.results.pages'
   | typeof itemTypeTranslations.short[0]
   | `rarity.${Rarity}`
   | `weight.${Weight}`
  >
}

export const Search: FC<SearchProps> = ({ translations }) => {
  const [open, setOpen] = useState(false);
  const { input, setInput, filter, options } = useSearch(translations, open);
  const searchValue = useDebounce(input, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, context, x, y } = useFloating({
    open,
    onOpenChange: (open) => { console.log('onOpenChange', open); setOpen(open); },
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      shift({ padding: 16 }),
      size({
        apply({ rects, availableHeight, elements, availableWidth }) {
          Object.assign(elements.floating.style, {
            width: `${Math.min(availableWidth, Math.max(360, rects.reference.width))}px`,
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

  // const searchResults = [
  //   ...useSearchApiResults(searchValue, translations),
  //   usePageResults(searchValue),
  // ];

  // const loading = searchResults.some((result) => result.loading);
  const loading = false;

  let index = 0;

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setInput(e.target.value);
    setOpen(true);
  }, [setInput]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if(e.key === 'Enter' && activeIndex !== null) {
      const current = listRef.current[activeIndex];

      if(current === null) {
        return;
      }

      current.click();
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, [activeIndex]);

  // global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.target instanceof HTMLElement && (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      if(e.key === 's' || e.key === '/' || e.code === 'Slash') {
        e.preventDefault();
        e.stopPropagation();

        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keypress', handler);
    return () => window.removeEventListener('keypress', handler);
  }, []);

  return (
    <form className={styles.search} ref={refs.setReference} {...getReferenceProps()}>
      <Icon icon="search"/>
      {filter?.slice(0, 2).map((filter, i) => <span key={i} className={styles.tag}>{filter}</span>)}
      {filter && filter.length > 2 && <span className={styles.tag}>…</span>}
      <input
        ref={inputRef}
        className={styles.searchInput}
        placeholder={translations['search.placeholder']}
        autoComplete="off"
        spellCheck="false"
        enterKeyHint="search"
        value={input}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}/>

      {!loading && !open && (<div className={styles.shortcut}><kbd>/</kbd> or <kbd>s</kbd></div>)}

      {loading && (open || searchValue) && <div className={styles.loading}/>}

      {open && (
        <div className={styles.dropdown} ref={refs.setFloating} {...getFloatingProps()} style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
        >
          {options.map((option) => {
            if(option.type === 'header') {
              return (
                <div className={styles.category} key={option.id}>
                  {option.title}
                </div>
              );
            }

            const currentIndex = index++;

            type Element<T extends ElementType> = { type: T, props: ComponentPropsWithoutRef<T> };
            const element: Element<ElementType> = option.type === 'button'
              ? { type: 'button', props: {}}
              : { type: Link, props: { href: option.href }};

            const node = (
              <element.type
                tabIndex={-1}
                key={option.id}
                className={activeIndex === currentIndex ? styles.resultActive : styles.result}
                ref={(node: TODO) => { listRef.current[currentIndex] = node; }}
                {...element.props}
                {...getItemProps({
                  onClick: (e) => {
                    console.log('click', e.defaultPrevented);

                    if(e.defaultPrevented) {
                      return;
                    }

                    if(option.type === 'button') {
                      option.onClick();
                      e.preventDefault();
                    } else {
                      setOpen(false);
                    }
                  }
                })}
              >
                <div className={styles.icon}>{typeof option.icon === 'string' ? <Icon icon={option.icon}/> : option.icon}</div>
                <div className={styles.title}>{option.title}</div>
                {option.subtitle && (<div className={styles.subtitle}>{option.subtitle}</div>)}
                {option.rightIcon && <span className={styles.external}><Icon icon={option.rightIcon}/></span>}
              </element.type>
            );

            return option.render ? <Fragment key={option.id}>{option.render(node)}</Fragment> : node;
          })}
          {/* {searchResults.map(({ results, id }) => results.length > 0 && (
            <Fragment key={id}>
              <div className={styles.category}>{translations[`search.results.${id}`]}</div>
              {results.map((result) => {
                const currentIndex = index++;
                const render = result.render ?? ((link: ReactElement) => link);

                const isExternal = result.href.startsWith('http');

                return render(
                  <Link
                    tabIndex={-1}
                    href={result.href}
                    key={result.href}
                    className={activeIndex === currentIndex ? styles.resultActive : styles.result}
                    id={result.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer noopener' : undefined}
                    ref={(node) => { listRef.current[currentIndex] = node; }}
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
                    {isExternal && <span className={styles.external}><Icon icon="external"/></span>}
                  </Link>
                );
              })}
            </Fragment>
          ))} */}
        </div>
      )}
    </form>
  );
};
