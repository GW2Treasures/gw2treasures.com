export function cx(...args: (string | undefined | false)[]): string {
  return args.filter(Boolean).join(' ');
}
