import { vi } from 'vitest';

// mock after
vi.mock('next/server', () => ({
  __esModule: true,
  after: vi.fn((cb) => cb())
}));

vi.mock('server-only', () => ({}));
