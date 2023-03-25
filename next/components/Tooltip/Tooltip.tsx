'use client';

import { autoUpdate, flip, FloatingPortal, offset, shift, useClientPoint, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';
import { Children, cloneElement, FC, ReactElement, ReactNode, useRef, useState } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
};

export const Tooltip: FC<TooltipProps> = ({ children, content }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, refs, strategy, context, middlewareData } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({ padding: { top: 64, bottom: 8, left: 8, right: 8 }}),
      shift({ padding: 8 }),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClientPoint(context),
    useHover(context, { move: true }),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  return (
    <>
      {cloneElement(Children.only(children), { ref: refs.setReference, ...getReferenceProps(children.props) })}
      <FloatingPortal>
        {isMounted && (
          <div
            ref={refs.setFloating}
            className={styles.tooltip}
            style={{
              ...transitionStyles,
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            <div>{content}</div>
            <div className={styles.arrow} ref={arrowRef} style={{
              left: middlewareData.arrow?.x ?? undefined,
              top: middlewareData.arrow?.y ?? undefined
            }}/>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
