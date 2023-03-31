import { FC } from 'react';
import styles from './Select.module.css';

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string, label: string }[];
}

export const Select: FC<SelectProps> = ({ value, onChange, options }) => {
  return (
    <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
    </select>
  );
};
