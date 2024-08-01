import { type ChangeEvent, type FC, useCallback, type HTMLInputAutoCompleteAttribute } from 'react';
import styles from './TextInput.module.css';

export interface TextInputProps {
  type?: 'text' | 'password' | 'search'
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

export const TextInput: FC<TextInputProps> = ({ type = 'text', onChange, ...props }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return (
    <input className={styles.input} type={type} onChange={onChange && handleChange} {...props}/>
  );
};
