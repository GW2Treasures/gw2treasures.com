import { isTruthy, type Falsy } from '@gw2treasures/helper/is';

export function cx(...args: (string | Falsy)[]): string {
  return args.filter(isTruthy).join(' ');
}
