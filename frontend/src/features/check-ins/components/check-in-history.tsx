import { History } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CheckIn } from '@/features/check-ins/types/check-in.types';

export interface CheckInHistoryProps {
  title: string;
  dateColumnLabel: string;
  weightColumnLabel: string;
  waistColumnLabel: string;
  deltaColumnLabel: string;
  notesColumnLabel: string;
  checkIns: CheckIn[];
}

function formatDelta(deltaWeightKg: number | null): string {
  if (deltaWeightKg === null) return '-';

  const sign = deltaWeightKg > 0 ? '+' : '';
  return `${sign}${deltaWeightKg.toFixed(1)}`;
}

// Visualização — docs/project/fitliving-web.md section 5.2. Most recent first.
export function CheckInHistory(props: CheckInHistoryProps) {
  const {
    title,
    dateColumnLabel,
    weightColumnLabel,
    waistColumnLabel,
    deltaColumnLabel,
    notesColumnLabel,
    checkIns,
  } = props;

  const orderedCheckIns = [...checkIns].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History aria-hidden="true" className="text-primary size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted-foreground border-b">
                <th scope="col" className="py-2 pr-3 font-medium">
                  {dateColumnLabel}
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  {weightColumnLabel}
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  {waistColumnLabel}
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  {deltaColumnLabel}
                </th>
                <th scope="col" className="py-2 font-medium">
                  {notesColumnLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {orderedCheckIns.map((checkIn) => (
                <tr key={checkIn.id} className="border-b last:border-0">
                  <td className="py-2 pr-3">{checkIn.date}</td>
                  <td className="py-2 pr-3">{checkIn.weightKg.toFixed(1)}</td>
                  <td className="py-2 pr-3">{checkIn.waistCm.toFixed(1)}</td>
                  <td className="py-2 pr-3">{formatDelta(checkIn.deltaWeightKg)}</td>
                  <td className="text-muted-foreground py-2">{checkIn.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
