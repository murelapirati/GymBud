import { MuscleGroup, MuscleStatus } from '../../types';
import { getStrengthPointChanges } from '../rankingEngine';

describe('strength point changes', () => {
  it('returns before, after, delta, and rank transitions for trained muscles', () => {
    const changes = getStrengthPointChanges(
      {
        chest: {
          muscle: 'chest',
          currentScore: 59,
          bestScore: 59,
          rank: 'gold',
          lastTrained: '2026-10-01',
        } as unknown as Record<MuscleGroup, MuscleStatus>,
      } as unknown as Record<MuscleGroup, MuscleStatus>,
      {
        chest: {
          muscle: 'chest',
          currentScore: 87,
          bestScore: 90,
          rank: 'diamond',
          lastTrained: '2026-10-09',
        },
      } as unknown as Record<MuscleGroup, MuscleStatus>,
    );

    expect(changes).toEqual([
      {
        muscle: 'chest',
        before: 59,
        after: 87,
        delta: 28,
        previousRank: 'gold',
        currentRank: 'diamond',
      },
    ]);
  });
});
