import { getExtendedEndTimestamp, getRemainingSeconds, hasTimerEnded } from '../restTimer';

describe('rest timer logic', () => {
  it('calculates remaining time from an absolute end timestamp', () => {
    expect(getRemainingSeconds(10_000, 8_501)).toBe(2);
    expect(getRemainingSeconds(10_000, 10_001)).toBe(0);
  });

  it('detects a timer that ended while the app was backgrounded', () => {
    expect(hasTimerEnded(10_000, 10_001)).toBe(true);
    expect(getRemainingSeconds(10_000, 10_001)).toBe(0);
  });

  it('reschedules the end timestamp when 15 seconds are added', () => {
    expect(getExtendedEndTimestamp(10_000, 15)).toBe(25_000);
    expect(getRemainingSeconds(getExtendedEndTimestamp(10_000, 15), 10_000)).toBe(15);
  });
});
