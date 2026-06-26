import React from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { PieChartLogo } from '@/components/Icons';
import { formatDuration } from '@/lib/stats';

const BAR_COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
];

export function SubjectBreakdown({ data }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <PieChartLogo className="size-5" />
          <h2 className="text-lg font-semibold">By Subject</h2>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Tag your sessions with a subject to see where your time goes.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {data.map((item, i) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="ml-2 shrink-0 text-muted-foreground">
                    {formatDuration(item.value)} · {Math.round(item.pct * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
