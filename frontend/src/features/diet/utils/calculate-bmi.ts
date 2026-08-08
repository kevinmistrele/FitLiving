export interface BmiResult {
  bmi: number;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
}

// WHO BMI formula + healthy weight range for the given height — docs/firestore-data-model.md
// section 2.3. Display-only: doesn't feed into any other calculation.
export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100;
  const heightMSquared = heightM * heightM;

  return {
    bmi: weightKg / heightMSquared,
    healthyWeightMinKg: 18.5 * heightMSquared,
    healthyWeightMaxKg: 24.9 * heightMSquared,
  };
}
