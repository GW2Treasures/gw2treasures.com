import { ChangeEvent, FC, useCallback } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: 'text' | 'password' | 'search'
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TextInput: FC<TextInputProps> = ({ type = 'text', value, onChange, placeholder }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <input type={type} value={value} onChange={handleChange} className={styles.input} placeholder={placeholder}/>
  );
};
