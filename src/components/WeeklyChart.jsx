import React from 'react';
import { motion } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { BarChartLogo } from '@/components/Icons';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/stats';

export function WeeklyChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BarChartLogo className="size-5" />
          <h2 className="text-lg font-semibold">This Week</h2>
          <span className="ml-auto text-sm font-medium text-muted-foreground">
            {formatDuration(total)} total
          </span>
        </div>

        <div className="flex items-end gap-2">
          {data.map((d) => {
            // Leave headroom at the top for the value label.
            const pct = d.value > 0 ? Math.max((d.value / max) * 86, 8) : 0;
            return (
              <div
                key={d.key}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="relative flex h-40 w-full items-end justify-center"
                  title={`${d.fullLabel}: ${formatDuration(d.value)}`}
                >
                  {/* track */}
                  <div className="absolute inset-0 rounded-xl bg-muted/30 ring-1 ring-inset ring-border/40" />

                  {/* filled bar */}
                  <motion.div
                    className={cn(
                      'relative w-full overflow-visible rounded-xl ring-1 ring-inset ring-white/10',
                      d.isToday
                        ? 'bg-gradient-to-t from-primary to-primary/65 shadow-[0_6px_18px_-2px] shadow-primary/50'
                        : 'bg-gradient-to-t from-primary/45 to-primary/20 group-hover:from-primary/65 group-hover:to-primary/35'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  >
                    {/* glossy top highlight */}
                    <div className="absolute inset-x-0 top-0 h-1/3 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />

                    {/* value label above the bar */}
                    {d.value > 0 && (
                      <span
                        className={cn(
                          'absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tabular-nums',
                          d.isToday ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        {formatDuration(d.value)}
                      </span>
                    )}
                  </motion.div>
                </div>

                <span
                  className={cn(
                    'text-xs',
                    d.isToday
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
