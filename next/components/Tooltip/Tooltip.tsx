'use client';

import { autoUpdate, ElementProps, flip, FloatingContext, FloatingPortal, offset, shift, useClick, useClientPoint, useDismiss, useFloating, useFocus, useHover, useInteractions, useMergeRefs, useRole, useTransitionStyles } from '@floating-ui/react';
import { Children, cloneElement, FC, ReactElement, ReactNode, Ref, useMemo, useRef, useState } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  children: ReactElement & { ref?: Ref<unknown> };
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
      shift({ padding: 8, mainAxis: true, crossAxis: true }),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClientPoint(context),
    useHover(context, { move: true }),
    useClick(context, {
      ignoreMouse: true,
    }),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
    useMemo(() => ({
      reference: {
        onClick(event) {
          if(!context.open && context.dataRef.current.openEvent && 'pointerType' in context.dataRef.current.openEvent && context.dataRef.current.openEvent.pointerType === 'touch') {
            event.preventDefault();
          }
        },
      },
    }), [context.open, context.dataRef]),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  const ref = useMergeRefs(children.ref ? [refs.setReference, children.ref] : [refs.setReference]);

  return (
    <>
      {cloneElement(Children.only(children), { ...getReferenceProps(children.props), ref })}
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
