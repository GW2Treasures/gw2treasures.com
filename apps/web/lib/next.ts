/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Language } from '@gw2treasures/database';
import type { SearchParams } from './searchParams';
import type { ReactNode } from 'react';

type Params = Record<string, string | string[] | undefined>;

export interface PageProps<P extends Params = {}> {
  params: Promise<P & { language: Language }>,
  searchParams: SearchParams,
}

export interface LayoutProps<P extends Params = {}> {
  params: Promise<P & { language: Language }>,
  children: ReactNode,
}
