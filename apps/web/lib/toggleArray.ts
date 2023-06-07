export function toggleArray<T>(element: T): (arr: T[]) => T[] {
  return (arr) => {
    const filtered = arr.filter((x) => x !== element);

    if(filtered.length < arr.length) {
      return filtered;
    }

    return [...arr, element];
  };
}
