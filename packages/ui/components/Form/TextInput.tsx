import { ChangeEvent, FC, useCallback } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: 'text' | 'password' | 'search'
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
};

export const TextInput: FC<TextInputProps> = ({ type = 'text', value, defaultValue, onChange, placeholder, name, readOnly }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return (
    <input type={type} value={value} defaultValue={defaultValue} onChange={onChange && handleChange} className={styles.input} placeholder={placeholder} name={name} readOnly={readOnly}/>
  );
};
