import React from 'react';
import { cn } from '@/lib/utils';

// Which segments are lit for each character (classic 7-segment layout).
const SEGMENTS = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g'],
  ' ': [],
};

// Geometry for a single digit cell (in SVG user units).
const CELL_W = 12;
const CELL_H = 20;
const T = 2.4; // segment thickness
const B = T / 2; // bevel length
const X0 = 1;
const X1 = 11;
const Y0 = 1;
const YM = 10;
const Y1 = 19;

const hPts = (cy) =>
  `${X0},${cy} ${X0 + B},${cy - T / 2} ${X1 - B},${cy - T / 2} ${X1},${cy} ${X1 - B},${cy + T / 2} ${X0 + B},${cy + T / 2}`;

const vPts = (cx, yt, yb) =>
  `${cx},${yt} ${cx + T / 2},${yt + B} ${cx + T / 2},${yb - B} ${cx},${yb} ${cx - T / 2},${yb - B} ${cx - T / 2},${yt + B}`;

const SEG_POINTS = {
  a: hPts(Y0),
  g: hPts(YM),
  d: hPts(Y1),
  f: vPts(X0, Y0, YM),
  b: vPts(X1, Y0, YM),
  e: vPts(X0, YM, Y1),
  c: vPts(X1, YM, Y1),
};

/**
 * A scalable seven-segment LCD readout rendered as a single SVG.
 * Unlit segments stay faintly visible (ghosted) like a real LCD panel.
 */
export function SevenSegmentDisplay({
  value = '00:00',
  className,
  on = '#d6dbd6',
  off = 'rgba(214, 219, 214, 0.05)',
  colonOn = true,
  glow = true,
  glowColor,
}) {
  const litGlow = glowColor ?? on;
  let x = 0;
  const groups = [];

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];

    if (ch === ':') {
      const cx = x + 2.5;
      const dotColor = colonOn ? on : off;
      groups.push(
        <g key={i}>
          <circle cx={cx} cy={7} r={1.5} fill={dotColor} />
          <circle cx={cx} cy={13} r={1.5} fill={dotColor} />
        </g>
      );
      x += 5;
      continue;
    }

    const lit = SEGMENTS[ch] ?? [];
    groups.push(
      <g key={i} transform={`translate(${x}, 0)`}>
        {Object.keys(SEG_POINTS).map((name) => {
          const isOn = lit.includes(name);
          return (
            <polygon
              key={name}
              points={SEG_POINTS[name]}
              fill={isOn ? on : off}
            />
          );
        })}
      </g>
    );
    x += CELL_W + 1;
  }

  return (
    <svg
      className={cn(className)}
      viewBox={`0 0 ${x} ${CELL_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: '100%',
        height: 'auto',
        overflow: 'visible',
        display: 'block',
        filter: glow ? `drop-shadow(0 0 1.1px ${litGlow})` : 'none',
      }}
      aria-hidden="true"
    >
      {groups}
    </svg>
  );
}
