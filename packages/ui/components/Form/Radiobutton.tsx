import { type FC, type KeyboardEventHandler, type ReactNode, useCallback, useId, useRef } from 'react';
import styles from './Radiobutton.module.css';

export interface RadiobuttonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export const Radiobutton: FC<RadiobuttonProps> = ({ checked, onChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const labelOnKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback((e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      inputRef.current?.click();
      e.preventDefault();
    }
  }, []);

  return (
    <label htmlFor={id} className={styles.wrapper} tabIndex={0} onKeyDown={labelOnKeyDown}>
      <input id={id} ref={inputRef} type="radio" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.input} tabIndex={-1}/>
      <div className={styles.radio}/>
      <div className={styles.label}>
        {children}
      </div>
    </label>
  );
};
