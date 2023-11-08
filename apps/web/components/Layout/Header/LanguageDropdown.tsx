'use client';

import { DropDown } from '@/components/DropDown/DropDown';
import { Button } from '@gw2treasures/ui/components/Form/Button';
import { Radiobutton } from '@gw2treasures/ui/components/Form/Radiobutton';
import { FormatConfigDialog } from '@/components/Format/FormatConfigDialog';
import { MenuList } from '@/components/MenuList/MenuList';
import { Icon } from '@gw2treasures/ui';
import { type FC, useCallback, useState } from 'react';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import styles from '../Layout.module.css';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/I18n/Context';
import type { Language } from '@gw2treasures/database';

export interface LanguageDropdownProps {
  // TODO: add props
}

const languages = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({ }) => {
  const { push } = useRouter();

  const [formatDialogOpen, setFormatDialogOpen] = useState(false);

  const language = useLanguage();
  const localeName = languages[language];

  const changeLanguage = useCallback((language: Language) => {
    const url = new URL(window.location.href);
    url.hostname = language + url.hostname.substring(2);
    push(url.href);
  }, [push]);

  return (
    <>
      <DropDown hideTop={false} preferredPlacement="bottom" button={(
        <Button appearance="menu">
          <Icon icon="locale"/><span className={styles.responsive}> {localeName}</span>
        </Button>
      )}
      >
        <MenuList>
          <Radiobutton checked={language === 'de'} onChange={() => changeLanguage('de')}>{languages.de}</Radiobutton>
          <Radiobutton checked={language === 'en'} onChange={() => changeLanguage('en')}>{languages.en}</Radiobutton>
          <Radiobutton checked={language === 'es'} onChange={() => changeLanguage('es')}>{languages.es}</Radiobutton>
          <Radiobutton checked={language === 'fr'} onChange={() => changeLanguage('fr')}>{languages.fr}</Radiobutton>
          <Separator/>
          <Button onClick={() => setFormatDialogOpen(true)} appearance="menu">Formatting Settings…</Button>
        </MenuList>
      </DropDown>
      <FormatConfigDialog open={formatDialogOpen} onClose={() => setFormatDialogOpen(false)}/>
    </>
  );
};
