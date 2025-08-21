import { type FC, useMemo } from 'react';
import { Dialog } from '@gw2treasures/ui/components/Dialog/Dialog';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { Select } from '@gw2treasures/ui/components/Form/Select';
import { useLanguage } from '../I18n/Context';
import { MenuList } from '@gw2treasures/ui/components/Layout/MenuList';
import { useFormatContext } from './FormatContext';
import { FormatDate } from './FormatDate';
import { FormatNumber } from './FormatNumber';
import { Icon } from '@gw2treasures/ui';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import styles from './FormatConfigDialog.module.css';
import { useUser } from '../User/use-user';
import { withSuspense } from '@/lib/with-suspense';

export interface FormatConfigDialogProps {
  open: boolean;
  onClose: () => void
}

const defaultLocales = { languages: ['de', 'en', 'es', 'fr'], regions: ['US', 'GB', 'DE', 'FR', 'ES'] };
const localeRegex = /^([a-z]{2,4})([_-][a-z]{4})?[_-]([a-z]{2,3})?\b/i;

const { languages: availableLanguages, regions: availableRegions } = typeof window === 'undefined'
  ? defaultLocales
  : navigator.languages.reduceRight((available, lang) => {
    const match = lang.match(localeRegex);

    if(!match) {
      return available;
    }

    if(match[3]) {
      return {
        languages: [match[1], ...available.languages.filter((l) => l !== match[1])],
        regions: [match[3], ...available.regions.filter((r) => r !== match[3])]
      };
    }

    return { ...available, languages: [match[1], ...available.languages.filter((l) => l !== match[1])] };
  }, defaultLocales);

export const FormatConfigDialog: FC<FormatConfigDialogProps> = ({ open, onClose }) => {
  const { locale, language, region, setLocale, defaultRegion } = useFormatContext();
  const currentLanguage = useLanguage();

  const languages = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'language', fallback: 'none' });

    return availableLanguages.map((lang) => ({ value: lang, label: tryFormat(formatter, lang) }));
  }, [currentLanguage]);

  const regions = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'region', fallback: 'none' });

    return availableRegions.map((region) => ({ value: region, label: tryFormat(formatter, region) }));
  }, [currentLanguage]);

  return (
    <Dialog title="Formatting Settings" onClose={onClose} open={open}>
      <div className={styles.layout}>
        <FormatConfigDialogCookieNote/>
        <div className={styles.inputs}>
          <Label label="Language">
            <Select options={[{ label: `Current language (${currentLanguage})`, value: 'auto' }, ...languages]} value={language} onChange={(language) => setLocale(language, region)}/>
          </Label>
          <div className={styles.dash}>-</div>
          <Label label="Region">
            <Select options={[{ label: `Browser Region (${defaultRegion})`, value: 'browser' }, ...regions]} value={region} onChange={(region) => setLocale(language, region)}/>
          </Label>
        </div>

        <div className={styles.box}>
          <MenuList>
            <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Locale <span>{locale}</span></div>
            <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Date <FormatDate date={new Date()}/></div>
            <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Relative Date <FormatDate relative date={new Date()}/></div>
            <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Number <span><FormatNumber value={1234567.89}/></span></div>
          </MenuList>
        </div>
      </div>
    </Dialog>
  );
};

const FormatConfigDialogCookieNote = withSuspense(() => {
  const user = useUser();

  return !user && (
    <div className={styles.box}>
      <FlexRow><Icon icon="cookie"/> Changing your settings will store cookies in your browser.</FlexRow>
    </div>
  );
});

function tryFormat(formatter: Intl.DisplayNames, code: string) {
  try {
    const formatted = formatter.of(code);
    return formatted ? `${formatted} (${code})` : code;
  } catch {
    return code;
  }
}
