export function batch<T>(input: T[], batchSize: number): T[][] {
  const batches = [];

  for(let start = 0; start < input.length; start += batchSize) {
    batches.push(input.slice(start, start + batchSize));
  }

  return batches;
}
