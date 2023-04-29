import { Icon } from '../../icons';
import { KeyboardEventHandler, ReactNode, forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(({ checked, indeterminate = false, onChange, children }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const labelOnKeyDown: KeyboardEventHandler<HTMLLabelElement> = useCallback((e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      inputRef.current?.click();
      e.preventDefault();
    }
  }, []);

  return (
    <label htmlFor={id} className={styles.wrapper} tabIndex={0} onKeyDown={labelOnKeyDown} ref={ref}>
      <input id={id} ref={inputRef} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.input} tabIndex={-1}/>
      <div className={styles.checkbox}><Icon icon="checkmark"/></div>
      <div className={styles.label}>
        {children}
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
