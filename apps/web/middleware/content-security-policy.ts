import type { NextMiddleware } from './types';
import { Language } from '@gw2treasures/database';

const baseDomain = process.env.GW2T_NEXT_DOMAIN;
const languageSubdomains = [...Object.values(Language)];

export const contentSecurityPolicyMiddleware: NextMiddleware = async (request, next, data) => {
  const url = data.url;
  const subdomain = data.subdomain;

  // skip CSP for api.gw2treasures.com
  if(subdomain === 'api') {
    return next(request);
  }

  // generate nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // set port if its not a default port (for local development) including `:`
  const portSuffix = url?.port ? `:${url.port}` : '';

  // generate list of alternate language domains
  const alternateLanguageDomains = languageSubdomains
    .filter((language) => language !== subdomain)
    .map((language) => `${language}.${baseDomain}${portSuffix}`);

  // construct CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV !== 'production' ? '\'unsafe-eval\'' : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' icons-gw2.darthmaim-cdn.com render.guildwars2.com wiki.guildwars2.com;
    connect-src 'self' ${alternateLanguageDomains.join(' ')} api.guildwars2.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    report-uri https://gw2treasures.report-uri.com/r/d/csp/reportOnly;
    report-to csp;
  `.replace(/\s{2,}/g, ' ');

  // reporting endpoints for csp/default
  const reportingEndpoints = [
    'default="https://gw2treasures.report-uri.com/a/d/g"',
    'csp="https://gw2treasures.report-uri.com/r/d/csp/reportOnly"'
  ];

  // set x-nonce and CSP for internal request
  request.headers.set('X-Nonce', nonce);
  request.headers.set('Content-Security-Policy-Report-Only', cspHeader);

  // get response
  const response = await next(request);

  // set outgoing CSP and Reporting headers
  response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
  response.headers.set('Reporting-Endpoints', reportingEndpoints.join(', '));

  return response;
};
