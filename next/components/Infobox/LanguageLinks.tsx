import { useRouter } from 'next/router';
import { cloneElement, FC, ReactElement } from 'react';
import styles from './LanguageLinks.module.css';

interface LanguageLinksProps {
  link: ReactElement<{ locale: string }>;
};

export const LanguageLinks: FC<LanguageLinksProps> = ({ link }) => {
  const router = useRouter();

  return (
    <div className={styles.languages}>
      {router.locale !== 'de' && (<><div className={styles.lang}>DE</div>{cloneElement(link, { locale: 'de' })}</>)}
      {router.locale !== 'en' && (<><div className={styles.lang}>EN</div>{cloneElement(link, { locale: 'en' })}</>)}
      {router.locale !== 'es' && (<><div className={styles.lang}>ES</div>{cloneElement(link, { locale: 'es' })}</>)}
      {router.locale !== 'fr' && (<><div className={styles.lang}>FR</div>{cloneElement(link, { locale: 'fr' })}</>)}
    </div>
  );
};
