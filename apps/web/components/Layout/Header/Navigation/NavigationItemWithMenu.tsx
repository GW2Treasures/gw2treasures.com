'use client';

import { autoUpdate, flip, FloatingFocusManager, FloatingList, FloatingPortal, offset, safePolygon, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useListNavigation, useRole, useTransitionStyles, useDelayGroup } from '@floating-ui/react';
import { useRef, useState, type FC, type KeyboardEvent } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import { NavigationMenuContext } from './NavigationMenuContext';
import type { NavigationItemProps } from './NavigationItem';
import styles from './Navigation.module.css';

const hasFocusVisibleWithin = (...containers: (Element | null)[]) => {
  const active = document.activeElement;
  return !!active && active.matches(':focus-visible') && containers.some((container) => container?.contains(active));
};

export const NavigationItemWithMenu: FC<NavigationItemProps> = ({ href, menu, children, ...props }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [returnFocus, setReturnFocus] = useState(true);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const { refs: { setReference, setFloating }, elements, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (open, _event, reason) => {
      // moving the mouse away doesn't close the menu while it has keyboard focus
      if(!open && (reason === 'hover' || reason === 'safe-polygon') && hasFocusVisibleWithin(elements.domReference, elements.floating)) {
        return;
      }

      setOpen(open);

      // returning focus after the user moved on elsewhere would focus the trigger again and reopen the menu
      if(open) {
        setReturnFocus(true);
      } else if(reason === 'outside-press' || reason === 'focus-out' || reason === 'focus') {
        setReturnFocus(false);
      }
    },
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [offset(0), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { delay } = useDelayGroup(context);

  // the event still bubbles to the `Composite`, which moves the focus to the previous/next item
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      setOpen(false);
    }

    // the trigger is a link as well, so it is part of the vertical cycle: trigger -> first -> ... -> last -> trigger
    const items = elementsRef.current.filter(Boolean);
    const isFirst = event.target === items[0];
    const isLast = event.target === items[items.length - 1];

    if(((event.key === 'ArrowUp' && isFirst) || (event.key === 'ArrowDown' && isLast)) && elements.domReference instanceof HTMLElement) {
      event.preventDefault();
      elements.domReference.focus();
    }
  };

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useHover(context, { handleClose: safePolygon(), mouseOnly: true, delay }),
    useFocus(context),
    useRole(context, { role: 'menu' }),
    useDismiss(context),
    useListNavigation(context, { listRef: elementsRef, activeIndex, onNavigate: setActiveIndex, orientation: 'vertical', focusItemOnHover: false }),
    { floating: { onKeyDown: handleKeyDown }},
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  const referenceProps = getReferenceProps(props);

  return (
    <li className={styles.item} role="none">
      <CompositeItem role="menuitem" render={<LinkButton ref={setReference} href={href} appearance="menu" className={styles.button} {...referenceProps}>{children}</LinkButton>}/>

      {isMounted && (
        <FloatingPortal>
          {/* don't steal focus from the composite when opened with the mouse, list navigation focuses the items when opened with the keyboard */}
          <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={returnFocus}>
            <div ref={setFloating} className={styles.menu} style={{ ...transitionStyles, ...floatingStyles }} {...getFloatingProps()}>
              <NavigationMenuContext value={{ activeIndex, getItemProps, close: () => setOpen(false) }}>
                <FloatingList elementsRef={elementsRef}>
                  {menu}
                </FloatingList>
              </NavigationMenuContext>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </li>
  );
};
