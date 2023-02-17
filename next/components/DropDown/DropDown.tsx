import { arrow, autoUpdate, flip, FloatingFocusManager, FloatingPortal, hide, Middleware, offset, Placement, shift, Side, useClick, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@floating-ui/react-dom-interactions';
import { Children, cloneElement, FC, ReactElement, ReactNode, useRef, useState } from 'react';
import styles from './DropDown.module.css';
import { isTruthy } from 'lib/is';

export interface DropDown {
  button: ReactElement;
  children: ReactNode;
  preferredPlacement?: Placement;
  hideTop?: boolean;
};

export const DropDown: FC<DropDown> = ({ children, button, preferredPlacement = 'bottom-end', hideTop = true }) => {
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
      {cloneElement(Children.only(button), { ref: reference, ...getReferenceProps(button.props) })}
      {open && (
        <div
          ref={floating}
          className={styles.dropdown}
          style={{
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
            ...{ [staticSide]: -4.75 }
          }}/>
        </div>
      )}
    </>
  );
};
