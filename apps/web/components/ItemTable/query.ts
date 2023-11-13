import { signingKey } from './signingKey';
import type { ItemTableQuery } from './types';

export interface Signed<T> {
  data: T;
  signature: string;
}

export async function sign<T>(data: T): Promise<Signed<T>> {
  const key = await signingKey.getKey();
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
  const signature = Buffer.from(signatureBuffer).toString('base64');

  return { data, signature };
}

export async function verify<T>(signed: Signed<T>): Promise<T> {
  const { signature, data } = signed;

  const signatureBuffer = Buffer.from(signature, 'base64');
  const dataBuffer = Buffer.from(JSON.stringify(data), 'utf8');
  const key = await signingKey.getKey();

  const valid = await crypto.subtle.verify('HMAC', key, signatureBuffer, dataBuffer);

  if(!valid) {
    throw new Error('Invalid query signature');
  }

  return data;
}

export function createItemTableQuery(query: ItemTableQuery) {
  return sign(query);
};
