import { headers } from 'next/headers';

export function getCurrentUrl() {
  return new URL(headers().get('x-gw2t-real-url')!);
}
