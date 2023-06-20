import { ChangeEvent, FC, useCallback } from 'react';
import styles from './TextInput.module.css';

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export const NumberInput: FC<NumberInputProps> = ({ value, defaultValue, onChange, placeholder, name, readOnly, min, max, step }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const number = parseInt(e.target.value);
    onChange?.(number);
  }, [onChange]);

  return (
    <input type="number" value={value ?? ''} defaultValue={defaultValue} onChange={onChange && handleChange} className={styles.input} placeholder={placeholder} name={name} readOnly={readOnly} min={min} max={max} step={step}/>
  );
};
