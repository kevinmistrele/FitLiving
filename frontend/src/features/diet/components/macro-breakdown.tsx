import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DietGoals } from '@/features/diet/utils/calculate-diet-goals';

export interface MacroBreakdownProps {
  title: string;
  proteinLabel: string;
  carbsLabel: string;
  fatLabel: string;
  gramsUnit: string;
  lowBudgetWarning: string;
  dietGoals: DietGoals;
}

// Metas de macronutrientes, proteína destacada — docs/project/fitliving-web.md section 4.2.
// Protein gets its own visually distinct block (not just first in reading order) because the
// spec calls it out explicitly as the priority for preserving/gaining muscle.
export function MacroBreakdown(props: MacroBreakdownProps) {
  const { title, proteinLabel, carbsLabel, fatLabel, gramsUnit, lowBudgetWarning, dietGoals } =
    props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-primary text-base font-semibold">{proteinLabel}</span>
          <span className="text-primary text-2xl font-bold">
            {Math.round(dietGoals.proteinG)}
            {gramsUnit}{' '}
            <span className="text-primary/70 text-sm font-medium">
              ({Math.round(dietGoals.proteinKcal)} kcal)
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{carbsLabel}</p>
            <p className="text-lg font-medium">
              {Math.round(dietGoals.carbsG)}
              {gramsUnit}{' '}
              <span className="text-muted-foreground text-sm">
                ({Math.round(dietGoals.carbsKcal)} kcal)
              </span>
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{fatLabel}</p>
            <p className="text-lg font-medium">
              {Math.round(dietGoals.fatG)}
              {gramsUnit}{' '}
              <span className="text-muted-foreground text-sm">
                ({Math.round(dietGoals.fatKcal)} kcal)
              </span>
            </p>
          </div>
        </div>

        {dietGoals.isCarbsBudgetTooLow && (
          <p role="alert" className="text-destructive text-sm font-medium">
            {lowBudgetWarning}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
