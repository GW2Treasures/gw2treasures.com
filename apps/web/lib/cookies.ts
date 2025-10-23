import type { Language } from '@gw2treasures/database';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { expiresAtFromExpiresIn } from './expiresAtFromExpiresIn';

export const rememberLanguageCookieName = 'gw2t-l';

export function createRememberLanguageCookie(language: Language) {
  const baseDomain = new URL(process.env.GW2T_URL || document.documentElement.dataset.baseUrl!).hostname;

  return {
    name: rememberLanguageCookieName,
    value: language,
    domain: baseDomain,
    path: '/',
    expires: expiresAtFromExpiresIn(365 * 24 * 60 * 60),
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  } satisfies ResponseCookie;
}
