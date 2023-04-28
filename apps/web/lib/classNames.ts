import { Falsy, isTruthy } from '@gw2treasures/ui';

export function cx(...args: (string | Falsy)[]): string {
  return args.filter(isTruthy).join(' ');
}
