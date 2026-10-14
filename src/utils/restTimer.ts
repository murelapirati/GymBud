export const getRemainingSeconds = (endTimestamp: number, now = Date.now()): number =>
  Math.max(0, Math.ceil((endTimestamp - now) / 1000));

export const getExtendedEndTimestamp = (endTimestamp: number, additionalSeconds: number): number =>
  endTimestamp + additionalSeconds * 1000;

export const hasTimerEnded = (endTimestamp: number, now = Date.now()): boolean =>
  endTimestamp <= now;
