import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.json(['items', 'skills', 'skins']);
}

export function splitSearchTerms(query: string): string[] {
  const terms = Array.from(query.matchAll(/"(?:\\\\.|[^\\\\"])*"|\S+/g)).map((term) => {
    return unpackQuotes(term[0])
      .replaceAll('\\\\', '\\')
      .replaceAll('\\"', '"')
      .replaceAll('%', '\\%');
  });

  return terms;
}

export function unpackQuotes(value: string): string {
  if(value[0] === '"') {
    return value.substring(1, value.length - 1);
  }

  return value;
}

type LocalizedNameInput = {
  AND?: Prisma.Enumerable<LocalizedNameInput>;
  OR?: Prisma.Enumerable<LocalizedNameInput>;
  name_de?: Prisma.StringFilter | string;
  name_en?: Prisma.StringFilter | string;
  name_es?: Prisma.StringFilter | string;
  name_fr?: Prisma.StringFilter | string;
}

export function nameQuery(terms: string[]): LocalizedNameInput[] {
  const nameQueries: LocalizedNameInput[] = ['de', 'en', 'es', 'fr'].map((lang) => ({
    AND: terms.map((term) => ({ [`name_${lang}`]: { contains: term, mode: 'insensitive' }}))
  }));

  return nameQueries;
}
