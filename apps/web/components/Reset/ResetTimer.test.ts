import { getResetDate, type Reset } from './ResetTimer';

const testCases: { date: Date, reset: Date, type: Reset }[] = [
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'current-daily', reset: new Date('2024-04-02T00:00:00.00Z') },
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'last-daily', reset: new Date('2024-04-01T00:00:00.00Z') },
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'next-daily', reset: new Date('2024-04-03T00:00:00.00Z') },
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'current-weekly', reset: new Date('2024-04-01T07:30:00.00Z') },
  { date: new Date('2024-04-01T07:41:55.931Z'), type: 'current-weekly', reset: new Date('2024-04-08T07:30:00.00Z') },
  { date: new Date('2024-04-15T01:07:52.932Z'), type: 'current-weekly', reset: new Date('2024-04-15T07:30:00.00Z') },
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'last-weekly', reset: new Date('2024-03-25T07:30:00.00Z') },
  { date: new Date('2024-04-01T07:41:55.931Z'), type: 'last-weekly', reset: new Date('2024-04-01T07:30:00.00Z') },
  { date: new Date('2024-04-01T00:41:55.931Z'), type: 'next-weekly', reset: new Date('2024-04-08T07:30:00.00Z') },
  { date: new Date('2024-04-01T07:41:55.931Z'), type: 'next-weekly', reset: new Date('2024-04-15T07:30:00.00Z') },
];

describe('getResetDate', () => {
  for(const testCase of testCases) {
    it(`${testCase.type} of ${testCase.date.toISOString()}`, () => {
      expect(getResetDate(testCase.type, testCase.date)).toEqual(testCase.reset);
    });
  }
});
