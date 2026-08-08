import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WorkoutDay, WorkoutDayId } from '@/features/workouts/types/workout.types';
import { useTranslate } from '@/hooks/use-translate';

export interface WorkoutDayTabsProps {
  days: WorkoutDay[];
  selectedDayId: WorkoutDayId;
  onSelectDay: (dayId: WorkoutDayId) => void;
}

// The weekday abbreviation (Mon/Tue/...) is fixed app copy tied to the dayId enum — it's
// translated. `day.label` (e.g. "Full Body A") is user-editable data and is rendered as-is,
// per docs/architecture/i18n.md's "data returned by the API is not translated client-side".
const WEEKDAY_ABBREVIATION_KEYS: Record<WorkoutDayId, string> = {
  mon: 'workouts.days.mon',
  tue: 'workouts.days.tue',
  wed: 'workouts.days.wed',
  thu: 'workouts.days.thu',
  fri: 'workouts.days.fri',
};

// Segmented control for the 5 fixed training days — docs/project/fitliving-web.md section
// 3.1. Only used as a selector (no TabsContent/Panel): the exercise list below is driven
// directly by `selectedDayId` state instead of Tabs' own panel mounting.
export function WorkoutDayTabs(props: WorkoutDayTabsProps) {
  const { days, selectedDayId, onSelectDay } = props;
  const { t } = useTranslate();

  return (
    <Tabs value={selectedDayId} onValueChange={(value) => onSelectDay(value as WorkoutDayId)}>
      <TabsList className="w-full">
        {days.map((day) => (
          <TabsTrigger key={day.dayId} value={day.dayId} className="flex-1 flex-col gap-0 py-1">
            <span className="text-[0.65rem] opacity-70">
              {t(WEEKDAY_ABBREVIATION_KEYS[day.dayId])}
            </span>
            <span>{day.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
