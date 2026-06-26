import React from 'react';

// Full-color logo icons recreated as scalable SVGs (transparent background).
// They accept the same className sizing utilities as lucide icons (e.g. "size-6").

export function StopwatchLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* crown */}
      <rect x="9" y="0.6" width="6" height="1.5" rx="0.75" fill="#2ea3f2" />
      <rect x="10.4" y="1.6" width="3.2" height="2.2" rx="0.6" fill="#2f6fb0" />
      {/* speed lines */}
      <path d="M4.8 5.8 L6.7 7.2" stroke="#f5b301" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.6 4.7 L7.6 5.5" stroke="#f7d24a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19.2 5.8 L17.3 7.2" stroke="#f5b301" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.4 4.7 L16.4 5.5" stroke="#f7d24a" strokeWidth="1.4" strokeLinecap="round" />
      {/* body */}
      <circle cx="12" cy="14" r="8.2" fill="#f7f1ec" />
      <circle cx="12" cy="14" r="6" fill="#2ea3f2" />
      {/* ticks */}
      <g stroke="#0f3a5f" strokeWidth="1" strokeLinecap="round">
        <path d="M12 9 v1.4" />
        <path d="M12 17.6 v1.4" />
        <path d="M7 14 h1.4" />
        <path d="M15.6 14 h1.4" />
      </g>
      {/* hands */}
      <g stroke="#0f3a5f" strokeWidth="1.3" strokeLinecap="round">
        <path d="M12 14 V10.4" />
        <path d="M12 14 l2.7 2.7" />
      </g>
      <circle cx="12" cy="14" r="1" fill="#0f3a5f" />
    </svg>
  );
}

export function TrendingUpLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <g stroke="#1aa251" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 16 L9 10 L13 14 L20 6.5" />
        <path d="M14.5 6.5 H20.5 V12.5" />
      </g>
    </svg>
  );
}

export function BarChartLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* bars */}
      <rect x="2.8" y="14" width="4.6" height="7.2" rx="1" fill="#f5c518" />
      <rect x="9.7" y="11" width="4.6" height="10.2" rx="1" fill="#e8584f" />
      <rect x="16.6" y="7.8" width="4.6" height="13.4" rx="1" fill="#46c0e6" />
      {/* trend arrow */}
      <g stroke="#3aa776" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 L8 6 L12.5 9 L20 2.6" />
        <path d="M15.6 2.6 H20.6 V7" />
      </g>
    </svg>
  );
}

export function PieChartLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g stroke="#141414" strokeWidth="1.1" strokeLinejoin="round">
        {/* yellow: top -> right */}
        <path d="M12 12 L12 2 A10 10 0 0 1 22 12 Z" fill="#f5c863" />
        {/* blue: right -> lower right */}
        <path d="M12 12 L22 12 A10 10 0 0 1 18.43 19.66 Z" fill="#6fb1e0" />
        {/* green: lower right -> lower left */}
        <path d="M12 12 L18.43 19.66 A10 10 0 0 1 3.81 17.74 Z" fill="#5cb85c" />
        {/* red: lower left -> top */}
        <path d="M12 12 L3.81 17.74 A10 10 0 0 1 12 2 Z" fill="#e8584f" />
      </g>
    </svg>
  );
}

// A single four-point sparkle with concave sides.
function sparkle(cx, cy, s) {
  const k = s * 0.26;
  return (
    `M${cx} ${cy - s} ` +
    `Q${cx + k} ${cy - k} ${cx + s} ${cy} ` +
    `Q${cx + k} ${cy + k} ${cx} ${cy + s} ` +
    `Q${cx - k} ${cy + k} ${cx - s} ${cy} ` +
    `Q${cx - k} ${cy - k} ${cx} ${cy - s} Z`
  );
}

export function SparklesLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={sparkle(8.5, 13, 7.2)} fill="#ffe14d" />
      <path d={sparkle(17.5, 6, 4.2)} fill="#ffb02e" />
      <path d={sparkle(18.5, 18.5, 3.4)} fill="#ffb02e" />
    </svg>
  );
}

export function CalendarLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* binder rings */}
      <rect x="7" y="1.6" width="1.8" height="3.4" rx="0.9" fill="#2f6fb0" />
      <rect x="15.2" y="1.6" width="1.8" height="3.4" rx="0.9" fill="#2f6fb0" />
      {/* calendar body */}
      <rect x="2.5" y="3.6" width="19" height="16.8" rx="2.4" fill="#f7f1ec" />
      {/* header band */}
      <path
        d="M4.9 3.6 h14.2 a2.4 2.4 0 0 1 2.4 2.4 V7.6 H2.5 V6 A2.4 2.4 0 0 1 4.9 3.6 Z"
        fill="#2ea3f2"
      />
      {/* body outline */}
      <rect
        x="2.5"
        y="3.6"
        width="19"
        height="16.8"
        rx="2.4"
        stroke="#2f6fb0"
        strokeWidth="1.2"
      />
      {/* day marks */}
      <g fill="#a9bccb">
        <rect x="5.4" y="10" width="2.2" height="2.2" rx="0.5" />
        <rect x="9.3" y="10" width="2.2" height="2.2" rx="0.5" />
      </g>
      {/* clock badge */}
      <circle cx="16.4" cy="16" r="5" fill="#f7f1ec" stroke="#2ea3f2" strokeWidth="1.4" />
      <g stroke="#1b1b1b" strokeWidth="1.1" strokeLinecap="round">
        <path d="M16.4 16 V13.4" />
        <path d="M16.4 16 L18.2 17" />
      </g>
    </svg>
  );
}

export function RefreshLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="refresh-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc0fb" />
          <stop offset="1" stopColor="#2b8cf0" />
        </linearGradient>
      </defs>
      {/* top arrow arc: left -> over top -> right */}
      <path
        d="M4.5 12 A7.5 7.5 0 0 1 19.5 12"
        fill="none"
        stroke="url(#refresh-grad)"
        strokeWidth="3.2"
      />
      {/* bottom arrow arc: right -> under bottom -> left */}
      <path
        d="M19.5 12 A7.5 7.5 0 0 1 4.5 12"
        fill="none"
        stroke="url(#refresh-grad)"
        strokeWidth="3.2"
      />
      {/* downward arrowhead at right */}
      <path d="M16.3 11.6 H22.7 L19.5 15.8 Z" fill="url(#refresh-grad)" />
      {/* upward arrowhead at left */}
      <path d="M7.7 12.4 H1.3 L4.5 8.2 Z" fill="url(#refresh-grad)" />
    </svg>
  );
}
