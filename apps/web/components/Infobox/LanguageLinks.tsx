import type { Language } from '@gw2treasures/database';
import { cloneElement, type FC, type ReactElement } from 'react';
import styles from './LanguageLinks.module.css';

interface LanguageLinksProps {
  link: ReactElement<{ language: string }>;
  language: Language;
}

export const LanguageLinks: FC<LanguageLinksProps> = ({ link, language }) => {

  return (
    <div className={styles.languages}>
      {language !== 'de' && (<><div className={styles.lang}>DE</div>{cloneElement(link, { language: 'de' })}</>)}
      {language !== 'en' && (<><div className={styles.lang}>EN</div>{cloneElement(link, { language: 'en' })}</>)}
      {language !== 'es' && (<><div className={styles.lang}>ES</div>{cloneElement(link, { language: 'es' })}</>)}
      {language !== 'fr' && (<><div className={styles.lang}>FR</div>{cloneElement(link, { language: 'fr' })}</>)}
    </div>
  );
};
