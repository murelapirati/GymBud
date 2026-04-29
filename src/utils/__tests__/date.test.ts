import { getTodayDate } from '../date';

describe('date utility', () => {
  beforeAll(() => {
    // Mock the global Date object to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-28T10:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('getTodayDate should return the current date in YYYY-MM-DD format', () => {
    const today = getTodayDate();
    expect(today).toBe('2026-04-28');
  });
});
