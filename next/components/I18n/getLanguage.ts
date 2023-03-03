import { Language } from '@prisma/client';
import { cookies } from 'next/headers';

export function getLanguage() {
  const cookieLanguage = cookies().get('gw2t.lang')?.value;
  const language = cookieLanguage && cookieLanguage in Language ? cookieLanguage as Language : 'en';

  return language;
}
