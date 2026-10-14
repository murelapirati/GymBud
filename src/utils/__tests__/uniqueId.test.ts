import { createUniqueId } from '../uniqueId';

describe('createUniqueId', () => {
  it('returns different IDs for consecutive records', () => {
    const firstId = createUniqueId();
    const secondId = createUniqueId();

    expect(firstId).not.toBe(secondId);
  });
});
