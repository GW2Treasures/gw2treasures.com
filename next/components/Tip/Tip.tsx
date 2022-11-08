import { arrow, autoUpdate, flip, FloatingPortal, offset, Placement, shift, Side, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@floating-ui/react-dom-interactions';
import { Children, cloneElement, FC, ReactElement, ReactNode, useRef, useState } from 'react';
import styles from './Tip.module.css';

export interface TipProps {
  children: ReactElement;
  tip: ReactNode;
  preferredPlacement?: Placement;
};

export const Tip: FC<TipProps> = ({ children, tip, preferredPlacement = 'top' }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);

  const { x, y, reference, floating, strategy, context, middlewareData, placement } = useFloating({
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
      {cloneElement(Children.only(children), { ref: reference, ...getReferenceProps(children.props) })}
      <FloatingPortal>
        {open && (
          <div
            ref={floating}
            className={styles.tip}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            {...getFloatingProps()}
          >
            {tip}
            <div className={styles.arrow} ref={arrowRef} style={{
              left: middlewareData.arrow?.x ?? undefined,
              top: middlewareData.arrow?.y ?? undefined,
              '--arrow-side': sideIndex[staticSide],
              ...{ [staticSide]: -4.5 }
            }}/>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};
