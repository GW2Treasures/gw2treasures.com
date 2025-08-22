/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { SearchParams } from './searchParams';
import type { ReactNode } from 'react';
import type { NextRequest } from 'next/server';

type Params = Record<string, string | string[] | undefined>;

export interface PageProps<P extends Params = {}> {
  params: Promise<P>,
  searchParams: Promise<SearchParams>,
}

export interface LayoutProps<P extends Params = {}> {
  params: Promise<P>,
  children: ReactNode,
}

export interface RouteProps<P extends Params = {}> {
  params: Promise<P>
}

export type RouteHandler<P extends Params = {}> = (request: NextRequest, context: RouteProps<P>) => Promise<Response>;
