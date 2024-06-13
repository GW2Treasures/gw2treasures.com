'use client';

import { arrow, autoUpdate, flip, hide, offset, type Placement, shift, type Side, size, useClick, useDismiss, useFloating, useFocus, useInteractions, useTransitionStyles, FloatingPortal, FloatingFocusManager } from '@floating-ui/react';
import { Children, cloneElement, type FC, type ReactElement, type ReactNode, useRef, useState, type Ref, type HTMLProps } from 'react';
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
  const arrowRef = useRef<HTMLDivElement>(null);
  const padding = { top: 48 + 8, bottom: 8, left: 8, right: 8 };

  const { x, y, strategy, context, middlewareData, placement, refs } = useFloating({
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

  const staticSide = {
    top: 'bottom' as Side,
    right: 'left' as Side,
    bottom: 'top' as Side,
    left: 'right' as Side,
  }[placement.split('-')[0]] ?? 'top';

  const sideIndex = {
    bottom: 2,
    right: 1,
    top: 0,
    left: 3,
  };

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
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
              visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
            }}
            {...getFloatingProps()}
          >
            <FloatingFocusManager context={context} modal={false}>
              <div className={styles.content}>
                {children}
              </div>
              <div className={styles.arrow} ref={arrowRef} style={{
                left: middlewareData.arrow?.x ?? undefined,
                top: middlewareData.arrow?.y ?? undefined,
                '--arrow-side': sideIndex[staticSide],
                ...{ [staticSide]: 'calc(var(--arrow-size) * -0.5)' }
              }}/>
            </FloatingFocusManager>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
