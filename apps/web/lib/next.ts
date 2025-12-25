/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AppRouteHandlerRoutes } from '.next/types/routes';
import type { SearchParams } from './searchParams';
import type { NextRequest } from 'next/server';

type Params = Record<string, string | string[] | undefined>;

/** @deprecated Use Next.js `PageProps` instead */
export interface PageProps<P extends Params = {}> {
  params: Promise<P>,
  searchParams: Promise<SearchParams>,
}

export type RouteHandler<AppRouteHandlerRoute extends AppRouteHandlerRoutes> = (request: NextRequest, context: RouteContext<AppRouteHandlerRoute>) => Promise<Response>;
