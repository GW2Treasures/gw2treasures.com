import { type FC, useMemo } from 'react';
import { Dialog } from '../Dialog/Dialog';
import { Label } from '@gw2treasures/ui/components/Form/Label';
import { Select } from '@gw2treasures/ui/components/Form/Select';
import { useLanguage } from '../I18n/Context';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { MenuList } from '../MenuList/MenuList';
import { useFormatContext } from './FormatContext';
import { FormatDate } from './FormatDate';
import { FormatNumber } from './FormatNumber';

export interface FormatConfigDialogProps {
  open: boolean;
  onClose: () => void
}

const defaultLocales = { languages: ['de', 'en', 'es', 'fr'], regions: ['US', 'GB', 'DE', 'FR', 'ES'] };
const localeRegex = /^([a-z]{2,4})([_-][a-z]{4})?[_-]([a-z]{2,3})?/i;

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
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'language' });

    return availableLanguages.map((lang) => ({ value: lang, label: `${formatter.of(lang)} (${lang})` }));
  }, [currentLanguage]);

  const regions = useMemo(() => {
    const formatter = new Intl.DisplayNames(currentLanguage, { type: 'region' });

    return availableRegions.map((region) => ({ value: region, label: `${formatter.of(region)} (${region})` }));
  }, [currentLanguage]);

  return (
    <Dialog title="Formatting Settings" onClose={onClose} open={open}>
      <div style={{ display: 'flex', gap: 16 }}>
        <Label label="Language">
          <Select options={[{ label: `Current language (${currentLanguage})`, value: 'auto' }, ...languages]} value={language} onChange={(language) => setLocale(language, region)}/>
        </Label>
        <div style={{ lineHeight: '38px', marginTop: 24 }}>-</div>
        <Label label="Region">
          <Select options={[{ label: `Browser Region (${defaultRegion})`, value: 'browser' }, ...regions]} value={region} onChange={(region) => setLocale(language, region)}/>
        </Label>
      </div>

      <Separator/>

      <MenuList>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Locale <span>{locale}</span></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Date <FormatDate date={new Date()}/></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Relative Date <FormatDate relative date={new Date()}/></div>
        <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between' }}>Number <span><FormatNumber value={1234567.89}/></span></div>
      </MenuList>
    </Dialog>
  );
};
