import { MuscleGroup, RankTier } from '../types';

export type RankingGender = 'male' | 'female';
export const FEMALE_UPPER_BODY_THRESHOLD_SCALE = 0.65;
export const FEMALE_LOWER_BODY_THRESHOLD_SCALE = 0.75;
export const FEMALE_CORE_THRESHOLD_SCALE = 0.75;

const UPPER_BODY_MUSCLES: MuscleGroup[] = [
  'chest',
  'lats',
  'upper_back',
  'front_delts',
  'side_delts',
  'rear_delts',
  'biceps',
  'triceps',
  'forearms',
];

const CORE_MUSCLES: MuscleGroup[] = ['abs', 'obliques'];

const getFemaleThresholdScale = (muscle: MuscleGroup): number => {
  if (UPPER_BODY_MUSCLES.includes(muscle)) return FEMALE_UPPER_BODY_THRESHOLD_SCALE;
  if (CORE_MUSCLES.includes(muscle)) return FEMALE_CORE_THRESHOLD_SCALE;
  return FEMALE_LOWER_BODY_THRESHOLD_SCALE;
};

export const RANK_ORDER: RankTier[] = [
  'dirt', 'wood', 'iron', 'bronze',
  'gold', 'platinum', 'diamond', 'emerald', 'master', 'olympian',
];

export const MUSCLE_THRESHOLDS: Record<MuscleGroup, number[]> = {
  chest: [0, 15, 38, 60, 83, 100, 120, 173, 248, 338],
  lats: [0, 12, 30, 53, 75, 92, 113, 158, 218, 293],
  upper_back: [0, 12, 30, 53, 75, 92, 113, 158, 218, 293],
  lower_back: [0, 23, 53, 90, 128, 155, 188, 263, 360, 480],
  front_delts: [0, 12, 27, 45, 68, 83, 98, 135, 188, 255],
  side_delts: [0, 3, 8, 15, 23, 30, 38, 57, 83, 113],
  rear_delts: [0, 3, 8, 15, 23, 30, 38, 57, 83, 113],
  biceps: [0, 5, 11, 18, 27, 34, 42, 60, 83, 113],
  triceps: [0, 6, 15, 27, 42, 52, 63, 90, 123, 165],
  forearms: [0, 5, 11, 18, 27, 34, 42, 60, 83, 113],
  abs: [0, 3, 8, 14, 21, 25, 30, 42, 57, 75],
  obliques: [0, 3, 8, 14, 21, 25, 30, 42, 57, 75],
  quads: [0, 18, 45, 75, 113, 138, 165, 233, 315, 420],
  hamstrings: [0, 15, 38, 60, 90, 113, 135, 188, 255, 338],
  glutes: [0, 18, 45, 75, 113, 138, 165, 233, 315, 420],
  calves: [0, 12, 30, 53, 83, 100, 120, 173, 240, 330],
};

export const getMuscleThresholds = (
  muscle: MuscleGroup,
  gender: RankingGender = 'male',
): number[] => {
  const thresholds = MUSCLE_THRESHOLDS[muscle] || MUSCLE_THRESHOLDS.chest;
  if (gender === 'male') return thresholds;
  const scale = getFemaleThresholdScale(muscle);
  return thresholds.map(threshold => Math.round(threshold * scale * 100) / 100);
};

export const ONERM_FORMULAS = {
  epley: (w: number, r: number) => w * (1 + r / 30),
  brzycki: (w: number, r: number) => w * 36 / (37 - r),
  lombardi: (w: number, r: number) => w * Math.pow(r, 0.1),
  oconner: (w: number, r: number) => w * (1 + r / 40),
  mayhew: (w: number, r: number) => (w * 100) / (52.2 + 41.9 * Math.exp(-0.055 * r)),
  wathan: (w: number, r: number) => (w * 100) / (48.8 + 53.8 * Math.exp(-0.075 * r)),
  lander: (w: number, r: number) => (w * 100) / (101.3 - 2.67123 * r),
} as const;

export const ONERM_WEIGHTS = {
  epley: { base: 0.95, dropStart: 6, dropRate: 0.12, floor: 0.4 },
  brzycki: { base: 1.1, dropStart: 8, dropRate: 0.18, floor: 0.3 },
  lombardi: { base: 0.85, dropStart: 5, dropRate: 0.1, floor: 0.4 },
  oconner: { base: 0.9, dropStart: 6, dropRate: 0.12, floor: 0.4 },
  mayhew: { base: 0.95, dropStart: 8, dropRate: 0.1, floor: 0.5 },
  wathan: { base: 0.9, dropStart: 7, dropRate: 0.12, floor: 0.4 },
  lander: { base: 0.85, dropStart: 7, dropRate: 0.15, floor: 0.35 },
} as const;

export const REP_CAP = 15;

export const estimate1RM = (weight: number, reps: number): number | null => {
  if (weight <= 0 || reps < 1 || reps > REP_CAP) return null;
  if (reps === 1) return weight;

  let total = 0;
  let wsum = 0;
  for (const [name, fn] of Object.entries(ONERM_FORMULAS)) {
    const cfg = ONERM_WEIGHTS[name as keyof typeof ONERM_WEIGHTS];
    const drop = reps <= cfg.dropStart ? 1 : Math.max(cfg.floor, 1 - (reps - cfg.dropStart) * cfg.dropRate);
    const w = cfg.base * drop;
    total += fn(weight, reps) * w;
    wsum += w;
  }
  const result = total / wsum;
  return Number.isFinite(result) && result > 0 ? Number((Math.round(result * 10) / 10).toFixed(1)) : null;
};

export const calculate1RM = (weight: number, reps: number): number => {
  if (reps === 0) return 0;
  return estimate1RM(weight, reps) ?? 0;
};

export const getRankForScore = (
  muscle: MuscleGroup,
  score: number,
  gender: RankingGender = 'male',
): RankTier => {
  const thresholds = getMuscleThresholds(muscle, gender);
  for (let i = RANK_ORDER.length - 1; i >= 0; i -= 1) {
    if (score >= thresholds[i]) return RANK_ORDER[i];
  }
  return 'dirt';
};
