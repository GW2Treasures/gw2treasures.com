import type { Language } from '@gw2treasures/database';
import type { SearchParams } from './searchParams';

export interface PageProps<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Params extends Record<string, string | string[] | undefined> = {}
> {
  params: Params & { language: Language }
  searchParams: SearchParams
}
