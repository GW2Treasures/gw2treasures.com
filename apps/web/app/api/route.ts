import { getLanguage } from '@/lib/translate';
import { getCurrentUrl } from '@/lib/url';
import { NextResponse } from 'next/server';

const baseDomain = process.env.GW2T_NEXT_DOMAIN!;

export function GET() {
  const language = getLanguage();

  const documentation = getCurrentUrl();
  documentation.hostname = baseDomain;
  documentation.pathname = '/dev/api';

  return NextResponse.json({ api: true, language, documentation });
}
