import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { CheckIn } from '@/features/check-ins/types/check-in.types';

export interface CheckInChartProps {
  checkIns: CheckIn[];
  weightTitle: string;
  waistTitle: string;
  weightLabel: string;
  waistLabel: string;
  comfortableLabel: string;
  capLabel: string;
  overweightExitLabel: string;
  goalNovemberComfortableKg: number;
  goalCapKg: number;
  goalOverweightExitKg: number;
}

const weightChartConfig = {
  weightKg: { label: 'weight', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const waistChartConfig = {
  waistCm: { label: 'waist', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// Visualização — docs/project/fitliving-web.md section 5.2 (peso/cintura), plus the
// three reference goals from section 5.3 drawn as horizontal reference lines on the
// weight chart.
export function CheckInChart(props: CheckInChartProps) {
  const {
    checkIns,
    weightTitle,
    waistTitle,
    weightLabel,
    waistLabel,
    comfortableLabel,
    capLabel,
    overweightExitLabel,
    goalNovemberComfortableKg,
    goalCapKg,
    goalOverweightExitKg,
  } = props;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{weightTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weightChartConfig} className="aspect-auto h-64 w-full">
            <LineChart data={checkIns} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <ChartTooltip content={<ChartTooltipContent labelKey="date" />} />
              <ReferenceLine
                y={goalNovemberComfortableKg}
                stroke="var(--chart-3)"
                strokeDasharray="4 4"
                label={{ value: comfortableLabel, position: 'insideTopRight', fontSize: 11 }}
              />
              <ReferenceLine
                y={goalCapKg}
                stroke="var(--chart-4)"
                strokeDasharray="4 4"
                label={{ value: capLabel, position: 'insideTopRight', fontSize: 11 }}
              />
              <ReferenceLine
                y={goalOverweightExitKg}
                stroke="var(--chart-5)"
                strokeDasharray="4 4"
                label={{ value: overweightExitLabel, position: 'insideTopRight', fontSize: 11 }}
              />
              <Line
                dataKey="weightKg"
                name={weightLabel}
                type="monotone"
                stroke="var(--color-weightKg)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{waistTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={waistChartConfig} className="aspect-auto h-64 w-full">
            <LineChart data={checkIns} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={40}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <ChartTooltip content={<ChartTooltipContent labelKey="date" />} />
              <Line
                dataKey="waistCm"
                name={waistLabel}
                type="monotone"
                stroke="var(--color-waistCm)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
