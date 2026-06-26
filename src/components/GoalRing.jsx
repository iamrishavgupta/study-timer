import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const R = 45;
const CIRC = 2 * Math.PI * R;

export function GoalRing({ progress = 0, complete = false, className, children }) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <div className={cn('relative aspect-square', className)}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="5"
          className="stroke-muted"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          className={complete ? 'stroke-success' : 'stroke-primary'}
          initial={false}
          animate={{ strokeDashoffset: CIRC * (1 - clamped) }}
          transition={{ type: 'spring', stiffness: 60, damping: 16 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
