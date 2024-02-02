import { getUpdateCheckpoint } from './updateCheckpoints';

describe('updateCheckpoints', () => {
  test('grace period', () => {
    const buildDate = new Date();
    const checkpoint = getUpdateCheckpoint(buildDate);

    expect(checkpoint).toBeUndefined();
  });

  test('15 minutes', () => {
    // get build date 15 minutes ago
    const buildDate = new Date();
    buildDate.setMinutes(buildDate.getMinutes() - 15);

    const checkpoint = getUpdateCheckpoint(buildDate);

    expect(checkpoint).toBeDefined();
    expect(checkpoint!.valueOf() / 1000).toBeCloseTo(new Date().valueOf() / 1000);
  });

  test('45 minutes', () => {
    // get build date 45 minutes ago
    const buildDate = new Date();
    buildDate.setMinutes(buildDate.getMinutes() - 45);

    const expectedCheckpoint = new Date(buildDate);
    expectedCheckpoint.setMinutes(expectedCheckpoint.getMinutes() + 30);

    const checkpoint = getUpdateCheckpoint(buildDate);

    expect(checkpoint).toBeDefined();
    expect(checkpoint!.valueOf() / 1000).toBeCloseTo(expectedCheckpoint.valueOf() / 1000);
  });

  test('A long time ago, in a galaxy far, far away', () => {
    // get build date a long time ago
    const buildDate = new Date();
    buildDate.setDate(buildDate.getDate() - 42);

    const expectedCheckpoint = new Date(buildDate);
    expectedCheckpoint.setHours(expectedCheckpoint.getHours() + 6);

    const checkpoint = getUpdateCheckpoint(buildDate);

    expect(checkpoint).toBeDefined();
    expect(checkpoint!.valueOf() / 1000).toBeCloseTo(expectedCheckpoint.valueOf() / 1000);
  });
});
