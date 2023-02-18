import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react-dom-interactions';
import Icon from 'icons/Icon';
import { FC, ReactNode, useId } from 'react';
import styles from './Dialog.module.css';

export interface DialogProps {
  title: ReactNode,
  onClose: () => void
  children: ReactNode
}

export const Dialog: FC<DialogProps> = ({ children, title, onClose }) => {
  const { floating, context } = useFloating({
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

  return (
    <FloatingPortal>
      <FloatingOverlay className={styles.overlay}>
        <FloatingFocusManager context={context}>
          <div ref={floating} aria-labelledby={labelId} className={styles.dialog} {...getFloatingProps()}>
            <div className={styles.title}>
              <header id={labelId}>{title}</header>
              <button type="button" className={styles.close} onClick={onClose}><Icon icon="close"/></button>
            </div>
            <div className={styles.content}>
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
};
