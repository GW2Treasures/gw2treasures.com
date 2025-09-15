import { type ChangeEvent, type FC, useCallback } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps {
  value?: string,
  onChange?: (value: string) => void,
  defaultValue?: string,
  placeholder?: string,
  name?: string,
  readOnly?: boolean,
  autoFocus?: boolean,
}

export const Textarea: FC<TextareaProps> = ({ onChange, ...props }) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  return <textarea className={styles.textarea} onChange={onChange && handleChange} {...props}/>;
};
