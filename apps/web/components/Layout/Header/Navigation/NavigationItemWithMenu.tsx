'use client';

import { autoUpdate, flip, FloatingFocusManager, FloatingList, FloatingPortal, offset, safePolygon, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useListNavigation, useRole, useTransitionStyles, useDelayGroup } from '@floating-ui/react';
import { useRef, useState, type FC, type KeyboardEvent } from 'react';
import { LinkButton } from '@gw2treasures/ui/components/Form/Button';
import { CompositeItem } from '@gw2treasures/ui/components/Focus/Composite';
import { NavigationMenuContext } from './NavigationMenuContext';
import type { NavigationItemProps } from './NavigationItem';
import styles from './Navigation.module.css';

export const NavigationItemWithMenu: FC<NavigationItemProps> = ({ href, menu, children, ...props }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const { refs: { setReference, setFloating }, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    middleware: [offset(0), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { delay } = useDelayGroup(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useHover(context, { handleClose: safePolygon(), mouseOnly: true, delay }),
    useFocus(context),
    useRole(context, { role: 'menu' }),
    useDismiss(context),
    useListNavigation(context, { listRef: elementsRef, activeIndex, onNavigate: setActiveIndex, orientation: 'vertical', focusItemOnHover: false }),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  // the event still bubbles to the `Composite`, which moves the focus to the previous/next item
  const closeOnHorizontalNavigation = (event: KeyboardEvent<HTMLElement>) => {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      setOpen(false);
    }
  };

  const referenceProps = getReferenceProps(props);

  return (
    <li className={styles.item} role="none">
      <CompositeItem role="menuitem" render={<LinkButton ref={setReference} href={href} appearance="menu" className={styles.button} {...referenceProps}>{children}</LinkButton>}/>

      {isMounted && (
        <FloatingPortal>
          {/* don't steal focus from the composite when opened with the mouse, list navigation focuses the items when opened with the keyboard */}
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div ref={setFloating} className={styles.menu} style={{ ...transitionStyles, ...floatingStyles }} {...getFloatingProps({ onKeyDown: closeOnHorizontalNavigation })}>
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
