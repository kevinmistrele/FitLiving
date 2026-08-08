import type { CheckIn } from '@/features/check-ins/types/check-in.types';

const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export interface ProgressStats {
  totalLostKg: number;
  averagePaceKgPerWeek: number | null;
}

// Formulas per docs/firestore-data-model.md section 1.2 "Consultas típicas":
// total lost = initialWeightKg - most recent check-in weight;
// average pace = total lost / weeks between the first and last check-in date.
// `checkIns` must already be ordered by date ascending (see api/list-check-ins.ts).
export function calculateProgressStats(
  checkIns: CheckIn[],
  initialWeightKg: number,
): ProgressStats | null {
  if (checkIns.length === 0) {
    return null;
  }

  const firstCheckIn = checkIns[0];
  const lastCheckIn = checkIns[checkIns.length - 1];
  const totalLostKg = initialWeightKg - lastCheckIn.weightKg;

  const firstDate = new Date(firstCheckIn.date);
  const lastDate = new Date(lastCheckIn.date);
  const weeksElapsed = (lastDate.getTime() - firstDate.getTime()) / MILLISECONDS_PER_WEEK;

  return {
    totalLostKg,
    averagePaceKgPerWeek: weeksElapsed > 0 ? totalLostKg / weeksElapsed : null,
  };
}
