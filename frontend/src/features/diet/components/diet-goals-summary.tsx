import { Flame } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DietGoals } from '@/features/diet/utils/calculate-diet-goals';

export interface DietGoalsSummaryProps {
  title: string;
  tdeeLabel: string;
  targetCalLabel: string;
  bmiLabel: string;
  healthyWeightLabel: string;
  calculatedFromLabel: string;
  dietGoals: DietGoals;
}

// TDEE, meta calórica, IMC e faixa saudável — docs/project/fitliving-web.md section 4.1.
// Every number here comes straight from `dietGoals`, which is recomputed on every render from
// the latest profile (see use-diet-screen.hooks.ts), so it never needs its own loading state.
export function DietGoalsSummary(props: DietGoalsSummaryProps) {
  const {
    title,
    tdeeLabel,
    targetCalLabel,
    bmiLabel,
    healthyWeightLabel,
    calculatedFromLabel,
    dietGoals,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame aria-hidden="true" className="text-primary size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground text-sm">{tdeeLabel}</dt>
            <dd className="text-xl font-semibold">{Math.round(dietGoals.tdeeKcal)} kcal</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{targetCalLabel}</dt>
            <dd className="text-xl font-semibold">{Math.round(dietGoals.targetCalKcal)} kcal</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{bmiLabel}</dt>
            <dd className="text-xl font-semibold">{dietGoals.bmi.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground text-sm">{healthyWeightLabel}</dt>
            <dd className="text-xl font-semibold">
              {dietGoals.healthyWeightMinKg.toFixed(0)}–{dietGoals.healthyWeightMaxKg.toFixed(0)} kg
            </dd>
          </div>
        </dl>
        <p className="text-muted-foreground text-sm">
          {calculatedFromLabel} {dietGoals.calculatedFromWeightKg.toFixed(1)} kg
        </p>
      </CardContent>
    </Card>
  );
}
