import { forwardRef, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, onClick }, ref) {
  return (
    <button ref={ref} onClick={onClick} className={styles.button}>{children}</button>
  );
});
