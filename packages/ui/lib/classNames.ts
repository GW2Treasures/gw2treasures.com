import { isTruthy, type Falsy } from '@gw2treasures/helper/is';

export function cx(...args: (string | Falsy | Record<string, boolean>)[]): string {
  return args.filter(isTruthy).flatMap((c) => typeof c === 'object' ? classObjectToString(c) : c).join(' ');
}

function classObjectToString(obj: Record<string, boolean>): string[] {
  return Object.entries(obj).filter(([, value]) => value).map(([key]) => key);
}
