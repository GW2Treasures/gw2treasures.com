import { Prisma } from '@gw2treasures/database';
import { signingKey } from './signingKey';

export interface ItemTableQuery {
  where: Prisma.ItemWhereInput;
}

export interface SignedItemTableQuery extends ItemTableQuery {
  signature: string;
}

export async function createItemTableQuery(data: ItemTableQuery): Promise<SignedItemTableQuery> {
  const key = await signingKey.getKey();
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
  const signature = Buffer.from(signatureBuffer).toString('base64');

  return { ...data, signature };
}

export async function decodeItemTableQuery(query: SignedItemTableQuery): Promise<ItemTableQuery> {
  const { signature, ...data } = query;

  const signatureBuffer = Buffer.from(signature, 'base64');
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
  const key = await signingKey.getKey();

  const valid = await crypto.subtle.verify('HMAC', key, signatureBuffer, dataBuffer);

  if(!valid) {
    throw new Error('Invalid query signature');
  }

  return data;
}
