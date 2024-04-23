export function expiresAtFromExpiresIn(expiresInSeconds: number) {
  const date = new Date();
  date.setSeconds(date.getSeconds() + expiresInSeconds);
  return date;
}
