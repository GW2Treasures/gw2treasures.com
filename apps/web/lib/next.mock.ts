import { vi } from 'vitest';

// mock after
vi.mock('next/server', () => ({
  __esModule: true,
  after: vi.fn((cb) => cb())
}));


// disable server-only
vi.mock('server-only', () => ({}));


// mock process.env
if(typeof window !== 'undefined') {
  // @ts-expect-error some next internals expect process.env to be defined (even in browser)
  globalThis.process = { env: {}, ...globalThis.process };
}
