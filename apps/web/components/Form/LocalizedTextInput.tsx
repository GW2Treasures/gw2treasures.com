import { Language } from '@gw2treasures/database';
import { FC, Fragment, useId } from 'react';
import styles from './LocalizedTextInput.module.css';

export interface LocalizedTextInputProps {
  value: Record<Language, string>;
  onChange: (language: Language, value: string) => void
}

const languages = Object.keys(Language) as Language[];

export const LocalizedTextInput: FC<LocalizedTextInputProps> = ({ value, onChange }) => {
  const id = useId();

  return (
    <div className={styles.box}>
      {languages.map((language) => (
        <Fragment key={language}>
          <label className={styles.lang} htmlFor={`${id}_${language}`}>{language.toUpperCase()}</label>
          <input className={styles.input} id={`${id}_${language}`} value={value[language]} onChange={(e) => onChange(language, e.target.value)}/>
        </Fragment>
      ))}
    </div>
  );
};
