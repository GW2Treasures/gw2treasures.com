'use client';

import { arrow, autoUpdate, flip, hide, offset, type Placement, shift, size, useClick, useDismiss, useFloating, useFocus, useInteractions, useTransitionStyles, FloatingPortal, FloatingFocusManager, FloatingArrow } from '@floating-ui/react';
import { Children, cloneElement, type FC, type ReactElement, type ReactNode, useRef, useState, type HTMLProps } from 'react';
import styles from './DropDown.module.css';
import { isTruthy } from '@gw2treasures/helper/is';

export interface DropDown {
  button: ReactElement<HTMLProps<HTMLElement>>;
  children: ReactNode;
  preferredPlacement?: Placement;
  hideTop?: boolean;
};

export const DropDown: FC<DropDown> = ({ children, button, preferredPlacement = 'bottom-end', hideTop = true }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const padding = { top: 48 + 8, bottom: 8, left: 8, right: 8 };

  const { context, middlewareData, refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    whileElementsMounted: autoUpdate,
    strategy: hideTop ? 'absolute' : 'fixed',
    middleware: [
      offset(8),
      flip({ padding, crossAxis: false, fallbackAxisSideDirection: 'end' }),
      shift({ padding }),
      shift({ padding: { top: 48 + 48 + 8 }, rootBoundary: 'document' }),
      hideTop && hide({ padding: { top: 48 }}),
      size({ padding, apply({ availableHeight, elements }) { elements.floating.style.setProperty('--max-height', `${availableHeight}px`); } }),
      arrow({ element: arrowRef, padding: 4 }),
    ].filter(isTruthy),
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useFocus(context),
    useDismiss(context),
    useClick(context),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  return (
    <>
      {cloneElement(Children.only(button), { ref: refs.setReference, ...getReferenceProps({ ...button.props, onClick: (e) => e.preventDefault() }) })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={styles.dropdown}
            style={{
              ...transitionStyles,
              ...floatingStyles,
              visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
            }}
            {...getFloatingProps()}
          >
            <FloatingFocusManager context={context} modal={false}>
              <div className={styles.content}>
                {children}
              </div>
            </FloatingFocusManager>
            <FloatingArrow context={context} ref={arrowRef} width={12} height={6} tipRadius={1} fill="var(--color-background)" stroke="var(--color-border-dark)" strokeWidth={1}/>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
