import React from 'react';
import { cn } from '@/lib/utils';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';

const CYAN = '#3fd9ef';
export const STOPWATCH_CYAN = CYAN;

export function formatDeviceTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// Cyan minute ticks around the dial, every fifth one longer and brighter.
function TickRing() {
  const ticks = [];
  const cx = 50;
  const cy = 50;
  for (let i = 0; i < 60; i++) {
    const ang = ((i * 6 - 90) * Math.PI) / 180;
    const major = i % 5 === 0;
    const rOuter = 47;
    const rInner = major ? 41 : 44;
    ticks.push(
      <line
        key={i}
        x1={cx + rOuter * Math.cos(ang)}
        y1={cy + rOuter * Math.sin(ang)}
        x2={cx + rInner * Math.cos(ang)}
        y2={cy + rInner * Math.sin(ang)}
        stroke={CYAN}
        strokeWidth={major ? 1.2 : 0.7}
        strokeLinecap="round"
        opacity={major ? 0.9 : 0.5}
      />
    );
  }
  return (
    <svg className="sw-ticks" viewBox="0 0 100 100" aria-hidden="true">
      {ticks}
    </svg>
  );
}

/**
 * Chrome stopwatch rendered as a dark app-icon tile.
 * The right pusher toggles start/pause, the left pusher resets.
 */
export function StopwatchDevice({
  time = 0,
  running = false,
  onToggle,
  onReset,
  className,
}) {
  const display = formatDeviceTime(time);
  const colonOn = running ? Math.floor(time) % 2 === 0 : true;

  return (
    <div className={cn('sw-device', className)}>
      {/* Side pushers tuck behind the bezel */}
      <button
        type="button"
        className="sw-btn sw-btn-left"
        onClick={onReset}
        aria-label="Reset stopwatch"
        title="Reset"
      />
      <button
        type="button"
        className="sw-btn sw-btn-right"
        onClick={onToggle}
        aria-label={running ? 'Pause stopwatch' : 'Start stopwatch'}
        title={running ? 'Pause' : 'Start'}
      />

      {/* Knurled crown */}
      <div className="sw-crown" />

      {/* Chrome bezel + black dial */}
      <div className="sw-bezel">
        <div className={cn('sw-dial', running && 'is-running')}>
          <TickRing />
          <div className="sw-dial-glare" />
          <div className="sw-screen-wrap">
            <SevenSegmentDisplay
              className="sw-digits"
              value={display}
              colonOn={colonOn}
              on={CYAN}
              off="rgba(63, 217, 239, 0.07)"
              glowColor={CYAN}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
