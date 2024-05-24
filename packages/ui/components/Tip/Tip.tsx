'use client';

import { arrow, autoUpdate, flip, FloatingPortal, offset, type Placement, shift, type Side, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';
import { Children, cloneElement, type FC, type ReactElement, type ReactNode, useRef, useState, type HTMLProps } from 'react';
import styles from './Tip.module.css';

export interface TipProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
  tip: ReactNode;
  preferredPlacement?: Placement;
};

export const Tip: FC<TipProps> = ({ children, tip, preferredPlacement = 'top' }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, refs, strategy, context, middlewareData, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: { top: 64, bottom: 8, left: 8, right: 8 }}),
      shift({ padding: 8 }),
      arrow({ element: arrowRef, padding: 4 })
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
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
      {cloneElement(Children.only(children), { ref: refs.setReference, ...getReferenceProps(children.props) })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className={styles.tip}
            style={{
              ...transitionStyles,
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            <div>{tip}</div>
            <div className={styles.arrow} ref={arrowRef} style={{
              left: middlewareData.arrow?.x ?? undefined,
              top: middlewareData.arrow?.y ?? undefined,
              '--arrow-side': sideIndex[staticSide],
              ...{ [staticSide]: 'calc(var(--arrow-size) * -0.5)' }
            }}/>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
