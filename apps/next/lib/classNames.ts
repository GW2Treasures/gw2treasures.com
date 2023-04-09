import { Falsy, isTruthy } from './is';

export function cx(...args: (string | Falsy)[]): string {
  return args.filter(isTruthy).join(' ');
}
