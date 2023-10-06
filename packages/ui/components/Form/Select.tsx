import { FC } from 'react';
import styles from './Select.module.css';

export interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string, label: string }[];
  name?: string;
  defaultValue?: string;
}

export const Select: FC<SelectProps> = ({ value, onChange, options, name, defaultValue }) => {
  return (
    <select className={styles.select} value={value} onChange={onChange ? (e) => onChange(e.target.value) : undefined} name={name} defaultValue={defaultValue}>
      {options.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
    </select>
  );
};
