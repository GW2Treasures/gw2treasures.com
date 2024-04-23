import type { NextMiddleware } from './types';
import { Language } from '@gw2treasures/database';
import { NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;

export const languageMiddleware: NextMiddleware = (request, next, data) => {
  const url = data.url;
  const subdomain = data.subdomain;

  if(!url) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // handle language not found
  if(!subdomain) {
    // if no language was detected we need to redirect to the correct domain
    const acceptLanguage = new Negotiator({ headers: Object.fromEntries(request.headers.entries()) }).languages();

    const language = acceptLanguage.length === 1 && acceptLanguage[0] === '*'
      ? Language.en
      : match(acceptLanguage, Object.values(Language), Language.en);

    url.hostname = `${language}.${baseDomain}`;

    // if we attempted to do this already, show error
    if(request.cookies.has('redirect_loop')) {
      return new NextResponse(`Could not redirect to ${url.toString()}.`, { status: 500 });
    }

    console.log(`> Redirecting to ${url}`);

    // create redirect
    const redirect = NextResponse.redirect(url);

    // set cookie to detect redirect loops
    redirect.cookies.set('redirect_loop', '1', { maxAge: 10 });

    // return redirect
    return redirect;
  }

  if(subdomain === 'api') {
    // handle api requests
    // set languae based on `lang` search param, fallback to en
    const lang = request.nextUrl.searchParams.get('lang');
    const isValidLang = lang && lang in Language;

    request.headers.set('x-gw2t-lang', isValidLang ? lang : 'en');
  } else {
    // handle normal language subdomains
    request.headers.set('x-gw2t-lang', subdomain);
  }

  return next(request);
};
