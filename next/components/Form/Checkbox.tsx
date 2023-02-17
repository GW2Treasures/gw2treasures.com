import { FC, useEffect, useRef } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, indeterminate = false, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return <input ref={ref} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className={styles.checkbox}/>;
};
