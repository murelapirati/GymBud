export type MeasurementSystem = 'metric' | 'imperial';

// Conversion constants
const LBS_TO_KG = 0.453592;
const KG_TO_LBS = 2.20462;

/**
 * Convert pounds to kilograms
 */
export const lbsToKg = (lbs: number): number => {
  return lbs * LBS_TO_KG;
};

/**
 * Convert kilograms to pounds
 */
export const kgToLbs = (kg: number): number => {
  return kg * KG_TO_LBS;
};

/**
 * Format weight for display based on measurement system
 * @param weight - Weight value (always stored in lbs internally)
 * @param system - Measurement system to display in
 * @param decimals - Number of decimal places (default: 1)
 */
export const formatWeight = (
  weight: number | undefined,
  system: MeasurementSystem,
  decimals: number = 1
): string => {
  if (weight === undefined || weight === null) return '';
  
  if (system === 'metric') {
    const kg = lbsToKg(weight);
    return `${kg.toFixed(decimals)}kg`;
  }
  
  return `${weight.toFixed(decimals)}lbs`;
};

/**
 * Get weight unit label
 */
export const getWeightUnit = (system: MeasurementSystem): string => {
  return system === 'metric' ? 'kg' : 'lbs';
};

/**
 * Get weight unit label with context (for inputs)
 */
export const getWeightLabel = (system: MeasurementSystem, isExtra: boolean = false): string => {
  const unit = getWeightUnit(system);
  if (isExtra) {
    return `Extra Weight (${unit})`;
  }
  return `Weight (${unit})`;
};

/**
 * Convert weight for display (returns just the number)
 * @param weight - Weight value (always stored in lbs internally)
 * @param system - Measurement system to display in
 */
export const convertWeightForDisplay = (
  weight: number | undefined,
  system: MeasurementSystem
): number | undefined => {
  if (weight === undefined || weight === null) return undefined;
  
  if (system === 'metric') {
    return lbsToKg(weight);
  }
  
  return weight;
};

/**
 * Convert weight from input to storage (always store in lbs)
 * @param inputWeight - Weight entered by user
 * @param system - Current measurement system
 */
export const convertWeightToStorage = (
  inputWeight: number,
  system: MeasurementSystem
): number => {
  if (system === 'metric') {
    return kgToLbs(inputWeight);
  }
  return inputWeight;
};
