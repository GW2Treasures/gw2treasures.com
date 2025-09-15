/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { SearchParams } from './searchParams';
import type { ReactNode } from 'react';
import type { NextRequest } from 'next/server';

type Params = Record<string, string | string[] | undefined>;

/** @deprecated Use Next.js `PageProps` instead */
export interface PageProps<P extends Params = {}> {
  params: Promise<P>,
  searchParams: Promise<SearchParams>,
}

/** @deprecated Use Next.js `LayoutProps` instead */
export interface LayoutProps<P extends Params = {}> {
  params: Promise<P>,
  children: ReactNode,
}

/** @deprecated Use Next.js `RouteContext` instead */
export interface RouteProps<P extends Params = {}> {
  params: Promise<P>,
}

export type RouteHandler<P extends Params = {}> = (request: NextRequest, context: RouteProps<P>) => Promise<Response>;
