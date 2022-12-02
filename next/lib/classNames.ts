import { isTruthy } from './is';

export function cx(...args: (string | undefined | false)[]): string {
  return args.filter(isTruthy).join(' ');
}
