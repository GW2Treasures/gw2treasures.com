import type { Language } from '@gw2treasures/database';

export interface PageProps<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Params extends Record<string, string | string[] | undefined> = {}
> {
  params: Params & { language: Language }
  searchParams: { [key: string]: string | string[] | undefined }
}
