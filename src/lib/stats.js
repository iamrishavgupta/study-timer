// Shared formatting + analytics helpers derived from saved sessions.

export function dateKey(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

// Current calendar week (Sunday -> Saturday) with total study seconds per day.
export function getWeeklyData(sessions) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // back to Sunday

  const todayKey = dateKey(today);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push({
      key: dateKey(d),
      label: d.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0),
      fullLabel: d.toLocaleDateString(undefined, { weekday: 'short' }),
      value: 0,
      isToday: dateKey(d) === todayKey,
    });
  }

  const byKey = Object.fromEntries(days.map((d) => [d.key, d]));
  sessions.forEach((s) => {
    const k = dateKey(s.timestamp);
    if (byKey[k]) byKey[k].value += s.duration || 0;
  });

  return days;
}

// Consecutive days with at least one session, allowing today to be empty.
export function getStreak(sessions) {
  if (!sessions.length) return 0;
  const set = new Set(sessions.map((s) => dateKey(s.timestamp)));
  const cursor = new Date();

  if (!set.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (set.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Total study time grouped by subject, sorted by most studied.
export function getSubjectBreakdown(sessions) {
  const map = {};
  sessions.forEach((s) => {
    const name = (s.subject && s.subject.trim()) || 'Untagged';
    map[name] = (map[name] || 0) + (s.duration || 0);
  });

  const total = Object.values(map).reduce((a, b) => a + b, 0);
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, pct: total ? value / total : 0 }))
    .sort((a, b) => b.value - a.value);
}

export function getUniqueSubjects(sessions) {
  const seen = [];
  sessions.forEach((s) => {
    const name = s.subject && s.subject.trim();
    if (name && !seen.includes(name)) seen.push(name);
  });
  return seen;
}
