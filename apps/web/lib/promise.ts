// custom implementation of Promise.withResolvers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers) because thats really new
export function createPromiseWithResolvers<T>(): PromiseWithResolvers<T> {
  let resolve: PromiseWithResolvers<T>['resolve'];
  let reject: PromiseWithResolvers<T>['reject'];

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: resolve!,
    reject: reject!
  };
}
