import { describe, expect, it } from 'vitest';
import { useStableArray } from './use-stable-array';
import { renderHook } from '@testing-library/react';

describe('useStableArray', () => {
  it('returns stable array', () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];

    expect(a).not.toBe(b);

    // render useStableArray(a)
    const { result, rerender } = renderHook(
      (array) => useStableArray(array),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b),
    rerender(b);
    expect(result.current).toBe(a);
  });

  it('updates if values change', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];

    // render useStableArray(a)
    const { result, rerender } = renderHook(
      (array) => useStableArray(array),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });

  it('updates if length decreases', () => {
    const a = [1, 2, 3];
    const b = [1, 2];

    // render useStableArray(a)
    const { result, rerender } = renderHook(
      (array) => useStableArray(array),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });

  it('updates if length increases', () => {
    const a = [1, 2];
    const b = [1, 2, 3];

    // render useStableArray(a)
    const { result, rerender } = renderHook(
      (array) => useStableArray(array),
      { initialProps: a }
    );

    expect(result.current).toBe(a);

    // render useStableArray(b)
    rerender(b);
    expect(result.current).toBe(b);
  });
});
