import { ChangeEvent, FC, useCallback } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: 'text' | 'password' | 'search'
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
};

export const TextInput: FC<TextInputProps> = ({ type = 'text', value, onChange, placeholder, name }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  const managedProps = value !== undefined || onChange !== undefined
    ? { onChange: handleChange, value }
    : {};

  return (
    <input type={type} {...managedProps} className={styles.input} placeholder={placeholder} name={name}/>
  );
};
