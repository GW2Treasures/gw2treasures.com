export type SearchParams = {
  [key: string]: string | string[] | undefined
};

export function getSearchParamAsString(value: SearchParams[string], defaultValue: string | undefined = undefined) {
  switch(typeof value) {
    case 'undefined': return defaultValue;
    case 'object': return value.at(-1); // array -> return last parameter
    case 'string': return value;
  }
}

export function getSearchParamAsNumber(value: SearchParams[string], defaultValue?: undefined): number | undefined;
export function getSearchParamAsNumber(value: SearchParams[string], defaultValue: number): number;
export function getSearchParamAsNumber(value: SearchParams[string], defaultValue: number | undefined = undefined) {
  const number = Number(getSearchParamAsString(value));

  return isNaN(number) ? defaultValue : number;
}
