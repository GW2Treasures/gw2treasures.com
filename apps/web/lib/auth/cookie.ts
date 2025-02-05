import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;

/** Name of session cookie */
export const SessionCookieName = 'gw2t-session';

/** Seconds until auth session expires */
export const expiresIn = 365 * 24 * 60 * 60; // 1 year

/** Base auth cookie settings */
export const authCookieSettings: Omit<ResponseCookie, 'value' | 'expires'> = {
  name: SessionCookieName,

  domain: baseDomain,
  sameSite: 'lax',
  httpOnly: true,
  priority: 'high',
  path: '/',

  // always set to secure
  // `localhost` is considered a secure origin so this works even in dev
  secure: true,
};

/** Create auth cookie with session id and expiration timestamp */
export function authCookie(sessionId: string, expiresAt: Date): ResponseCookie {
  return {
    ...authCookieSettings,

    value: sessionId,
    expires: expiresAt
  };
}
