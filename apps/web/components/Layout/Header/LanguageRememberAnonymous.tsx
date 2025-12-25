'use client';

import { CookieNotification } from '@/components/User/CookieNotification';
import { useUser } from '@/components/User/use-user';
import { createRememberLanguageCookie, rememberLanguageCookieName } from '@/lib/cookies';
import { useCookie } from '@/lib/use-cookie';
import type { Language } from '@gw2treasures/database';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { type FC } from 'react';

export interface LanguageRememberAnonymousProps {
  language: Language,
}

export const LanguageRememberAnonymous: FC<LanguageRememberAnonymousProps> = ({ language }) => {
  const user = useUser();
  const [rememberedLanguage, setRememberedLanguage] = useCookie(rememberLanguageCookieName);

  if(user || !('cookieStore' in window)) {
    return null;
  }

  const handleChange = (remember: boolean) => {
    const { expires, ...cookie } = createRememberLanguageCookie(language);

    if(remember) {
      setRememberedLanguage(language, {
        ...cookie,
        // convert Date to timestamp
        expires: expires.getTime(),
      });
    } else {
      setRememberedLanguage(undefined, cookie);
    }
  };

  return (
    <>
      <CookieNotification/>
      <Checkbox onChange={handleChange} checked={!!rememberedLanguage}>Remember Language</Checkbox>
      <Separator/>
    </>
  );
};
