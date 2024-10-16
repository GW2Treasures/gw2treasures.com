/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Language } from '@gw2treasures/database';
import type { SearchParams } from './searchParams';
import type { ReactNode } from 'react';
import type { NextRequest } from 'next/server';

type Params = Record<string, string | string[] | undefined>;

export interface PageProps<P extends Params = {}> {
  params: Promise<P & { language: Language }>,
  searchParams: Promise<SearchParams>,
}

export interface LayoutProps<P extends Params = {}> {
  params: Promise<P & { language: Language }>,
  children: ReactNode,
}

export interface RouteProps<P extends Params = {}> {
  params: Promise<P & { language: Language }>
}

export type RouteHandler<P extends Params = {}> = (request: NextRequest, context: RouteProps<P>) => Promise<Response>;
