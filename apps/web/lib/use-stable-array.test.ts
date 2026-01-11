import { describe, expect, it } from 'vitest';
import { useStableArray } from './use-stable-array';
import { renderHook } from 'vitest-browser-react';

describe('useStableArray', () => {
  it('returns stable array', async () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];

    expect(a).not.toBe(b);

    // render useStableArray(a)
    const { result, rerender } = await renderHook(
      (array) => useStableArray(array!),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b),
    rerender(b);
    expect(result.current).toBe(a);
  });

  it('updates if values change', async () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];

    // render useStableArray(a)
    const { result, rerender } = await renderHook(
      (array) => useStableArray(array!),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });

  it('updates if length decreases', async () => {
    const a = [1, 2, 3];
    const b = [1, 2];

    // render useStableArray(a)
    const { result, rerender } = await renderHook(
      (array) => useStableArray(array!),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });

  it('updates if length increases', async () => {
    const a = [1, 2];
    const b = [1, 2, 3];

    // render useStableArray(a)
    const { result, rerender } = await renderHook(
      (array) => useStableArray(array!),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });
});
