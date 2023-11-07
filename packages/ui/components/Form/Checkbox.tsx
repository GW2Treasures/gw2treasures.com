'use client';

import { Icon } from '../../icons';
import { type KeyboardEventHandler, type ReactNode, forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  formValue?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  children: ReactNode;
}

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(({ checked, defaultChecked, formValue, indeterminate = false, onChange, name, children }, ref) => {
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
      <input id={id} ref={inputRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} className={styles.input} tabIndex={-1} name={name} value={formValue}/>
      <div className={styles.checkbox}><Icon icon="checkmark"/></div>
      <div className={styles.label}>
        {children}
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
