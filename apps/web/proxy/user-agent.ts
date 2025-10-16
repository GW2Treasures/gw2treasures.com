import type { NextMiddleware } from './types';
import { isbot } from 'isbot';

export const userAgentMiddleware: NextMiddleware = (request, next) => {
  // parse useragent from request
  const ua = request.headers.get('User-Agent');

  // check if useragent is a bot
  const isBot = isbot(ua);

  // check if request is a prefetch request
  const isPrefetch = request.headers.get('Next-Router-Prefetch') === '1' || request.headers.get('X-Next-Router-Prefetch') === '1';

  // build flags array (bot, prefetch)
  const flags = [isBot && 'Bot', isPrefetch && 'Prefetch'].filter(Boolean);

  // log flags and useragent
  if(process.env.NODE_ENV === 'production') {
    console.log('  ' + (flags.length > 0 ? `(${flags.join(', ')}) ` : '') + (ua ?? '-'));
  }

  // append header if UA is a bot
  request.headers.append('x-gw2t-is-bot', isBot ? '1' : '0');
  request.headers.append('x-gw2t-is-prefetch', isPrefetch ? '1' : '0');

  return next(request);
};
