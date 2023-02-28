import { cloneElement, FC, ReactElement } from 'react';
import styles from './LanguageLinks.module.css';

interface LanguageLinksProps {
  link: ReactElement<{ locale: string }>;
};

export const LanguageLinks: FC<LanguageLinksProps> = ({ link }) => {
  const locale: string = 'en'; // TODO

  return (
    <div className={styles.languages}>
      {locale !== 'de' && (<><div className={styles.lang}>DE</div>{cloneElement(link, { locale: 'de' })}</>)}
      {locale !== 'en' && (<><div className={styles.lang}>EN</div>{cloneElement(link, { locale: 'en' })}</>)}
      {locale !== 'es' && (<><div className={styles.lang}>ES</div>{cloneElement(link, { locale: 'es' })}</>)}
      {locale !== 'fr' && (<><div className={styles.lang}>FR</div>{cloneElement(link, { locale: 'fr' })}</>)}
    </div>
  );
};
