import { Gauge, Target, TrendingDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

export interface CheckInProgressSummaryProps {
  title: string;
  totalLostTitle: string;
  averagePaceTitle: string;
  averagePaceUnit: string;
  notEnoughDataLabel: string;
  comfortableLabel: string;
  capLabel: string;
  overweightExitLabel: string;
  progressLabel: string;
  novemberBannerText: string;
  totalLostKg: number | null;
  averagePaceKgPerWeek: number | null;
  goalNovemberComfortableKg: number;
  goalCapKg: number;
  goalOverweightExitKg: number;
  goalProgressPercentage: number;
  isInsideNovemberWindow: boolean;
}

// Metas visuais — docs/project/fitliving-web.md section 5.3, plus the total-lost/average-pace
// stats from section 5.2.
export function CheckInProgressSummary(props: CheckInProgressSummaryProps) {
  const {
    title,
    totalLostTitle,
    averagePaceTitle,
    averagePaceUnit,
    notEnoughDataLabel,
    comfortableLabel,
    capLabel,
    overweightExitLabel,
    progressLabel,
    novemberBannerText,
    totalLostKg,
    averagePaceKgPerWeek,
    goalNovemberComfortableKg,
    goalCapKg,
    goalOverweightExitKg,
    goalProgressPercentage,
    isInsideNovemberWindow,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target aria-hidden="true" className="text-primary size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isInsideNovemberWindow && (
          <p
            role="status"
            className="border-primary/30 bg-primary/5 text-foreground rounded-lg border px-3 py-2 text-sm font-medium"
          >
            {novemberBannerText}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <TrendingDown aria-hidden="true" className="size-3.5" />
              {totalLostTitle}
            </p>
            <p className="text-xl font-semibold">
              {totalLostKg === null ? notEnoughDataLabel : `${totalLostKg.toFixed(1)} kg`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Gauge aria-hidden="true" className="size-3.5" />
              {averagePaceTitle}
            </p>
            <p className="text-xl font-semibold">
              {averagePaceKgPerWeek === null
                ? notEnoughDataLabel
                : `${averagePaceKgPerWeek.toFixed(2)} ${averagePaceUnit}`}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">{comfortableLabel}</dt>
            <dd className="font-medium">{goalNovemberComfortableKg} kg</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{capLabel}</dt>
            <dd className="font-medium">{goalCapKg} kg</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{overweightExitLabel}</dt>
            <dd className="font-medium">{goalOverweightExitKg} kg</dd>
          </div>
        </dl>

        <Progress value={goalProgressPercentage}>
          <ProgressLabel>{progressLabel}</ProgressLabel>
          <ProgressValue />
        </Progress>
      </CardContent>
    </Card>
  );
}
