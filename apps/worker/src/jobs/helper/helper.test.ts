import { describe, expect, it } from 'vitest';
import { getNamesWithFallback } from './helper';

describe('getNamesWithFallback', () => {
  const example = {
    de: { name: 'de' },
    en: { name: 'en' },
    es: { name: 'es' },
    fr: { name: 'fr' },
  };

  it('returns valid names', () => {
    expect(getNamesWithFallback(example, 'fallback'))
      .toEqual({ name_en: 'en', name_de: 'de', name_es: 'es', name_fr: 'fr' });
  });

  it('returns fallback for undefined', () => {
    expect(getNamesWithFallback({ ...example, en: { name: undefined }}, 'fallback').name_en).toBe('fallback');
  });

  it('returns fallback for empty string', () => {
    expect(getNamesWithFallback({ ...example, en: { name: '' }}, 'fallback').name_en).toBe('fallback');
  });

  it('returns fallback for whitespace string', () => {
    expect(getNamesWithFallback({ ...example, en: { name: '  \t' }}, 'fallback').name_en).toBe('fallback');
  });

  it('returns empty string for undefined fallback', () => {
    expect(getNamesWithFallback({ ...example, en: { name: undefined }}).name_en).toBe('');
  });

  it('returns empty string for falsy fallback', () => {
    expect(getNamesWithFallback({ ...example, en: { name: undefined }}, false).name_en).toBe('');
    expect(getNamesWithFallback({ ...example, en: { name: undefined }}, '').name_en).toBe('');
  });
});

