'use client';

import { Icon } from '../../icons';
import { type FC, type KeyboardEventHandler, type ReactNode, useCallback, useEffect, useId, useRef } from 'react';
import styles from './Checkbox.module.css';
import type { RefProp } from '../../lib/react';

export interface CheckboxProps extends RefProp<HTMLLabelElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  formValue?: string;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  name?: string;
  children: ReactNode;
  disabled?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({ ref, checked, defaultChecked, formValue, indeterminate = false, onChange, name, disabled, children }) => {
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
    <label htmlFor={id} className={disabled ? styles.disabled : styles.wrapper} tabIndex={0} onKeyDown={labelOnKeyDown} ref={ref} aria-disabled={disabled}>
      <input id={id} ref={inputRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} className={styles.input} tabIndex={-1} name={name} value={formValue} disabled={disabled}/>
      <div className={styles.checkbox}><Icon icon="checkmark"/></div>
      <div className={styles.label}>
        {children}
      </div>
    </label>
  );
};
