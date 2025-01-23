import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';
import { Icon } from '../../icons';
import { type FC, type ReactNode, type RefObject, useId } from 'react';
import styles from './Dialog.module.css';
import { TableOfContentContext } from '../TableOfContent/TableOfContent';

export interface DialogProps {
  children: ReactNode,
  title: ReactNode,
  open?: boolean,
  onClose: () => void,
  initialFocus?: number | RefObject<HTMLElement | null>,
}

export const Dialog: FC<DialogProps> = ({ children, title, open = true, onClose, initialFocus }) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange: onClose,
  });

  const { getFloatingProps } = useInteractions([
    useDismiss(context, {
      outsidePress: false,
      outsidePressEvent: 'mousedown',
    }),
    useRole(context),
  ]);

  const labelId = useId();

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context);

  return isMounted ? (
    <FloatingPortal>
      <FloatingOverlay className={styles.overlay} style={transitionStyles}>
        <FloatingFocusManager context={context} initialFocus={initialFocus}>
          <div ref={refs.setFloating} aria-labelledby={labelId} className={styles.dialog} {...getFloatingProps()}>
            <div className={styles.title}>
              <header id={labelId}>{title}</header>
              <button type="button" className={styles.close} onClick={onClose}><Icon icon="close"/></button>
            </div>
            <div className={styles.content}>
              <TableOfContentContext>
                {children}
              </TableOfContentContext>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  ) : null;
};
