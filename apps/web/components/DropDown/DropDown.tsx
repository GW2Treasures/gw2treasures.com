'use client';

import { arrow, autoUpdate, flip, hide, offset, Placement, shift, Side, useClick, useDismiss, useFloating, useFocus, useInteractions, useTransitionStyles } from '@floating-ui/react';
import { Children, cloneElement, FC, ReactElement, ReactNode, useRef, useState } from 'react';
import styles from './DropDown.module.css';
import { isTruthy } from '@gw2treasures/ui';

export interface DropDown {
  button: ReactElement;
  children: ReactNode;
  preferredPlacement?: Placement;
  hideTop?: boolean;
};

export const DropDown: FC<DropDown> = ({ children, button, preferredPlacement = 'bottom-end', hideTop = true }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, strategy, context, middlewareData, placement, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: { top: 64, bottom: 8, left: 8, right: 8 }, crossAxis: false, fallbackAxisSideDirection: 'end' }),
      shift({ padding: 8 }),
      hideTop && hide({ padding: { top: 48 }}),
      arrow({ element: arrowRef, padding: 4 })
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
      {cloneElement(Children.only(button), { ref: refs.setReference, ...getReferenceProps(button.props) })}
      {isMounted && (
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
          {children}
          <div className={styles.arrow} ref={arrowRef} style={{
            left: middlewareData.arrow?.x ?? undefined,
            top: middlewareData.arrow?.y ?? undefined,
            '--arrow-side': sideIndex[staticSide],
            ...{ [staticSide]: 'calc(var(--arrow-size) * -0.5)' }
          }}/>
        </div>
      )}
    </>
  );
};
