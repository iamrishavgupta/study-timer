import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Play,
  Pause,
  RotateCcw,
  Save,
  Maximize2,
  Minimize2,
  LogOut,
  Timer,
  Trash2,
  Settings2,
  Coffee,
  Target,
  Check,
  Loader2,
  Flame,
  Tag,
} from 'lucide-react';

import { db } from './firebase';
import { useAuth } from './AuthContext';
import Login from './Login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { StopwatchDevice, formatDeviceTime, STOPWATCH_CYAN } from '@/components/StopwatchDevice';
import { SevenSegmentDisplay } from '@/components/SevenSegmentDisplay';
import { WeeklyChart } from '@/components/WeeklyChart';
import { SubjectBreakdown } from '@/components/SubjectBreakdown';
import {
  StopwatchLogo,
  TrendingUpLogo,
  SparklesLogo,
  CalendarLogo,
  RefreshLogo,
} from '@/components/Icons';
import {
  formatDuration,
  getWeeklyData,
  getStreak,
  getSubjectBreakdown,
  getUniqueSubjects,
} from '@/lib/stats';

const GOAL_PRESETS = [1, 2, 4, 6, 8, 12];

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [todayTime, setTodayTime] = useState(0);
  const [weekTime, setWeekTime] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [sessionSubject, setSessionSubject] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(4 * 3600);
  const [showGoalSettings, setShowGoalSettings] = useState(false);

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroLoop, setPomodoroLoop] = useState(true);
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUsgc7y2Ik3CBlou+3nn00QDFA='));

  // Load this user's data from Firestore whenever they log in
  useEffect(() => {
    if (!user) {
      setDataLoaded(false);
      return;
    }

    let cancelled = false;
    setDataLoaded(false);

    (async () => {
      const today = new Date().toDateString();
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;

        if (snap.exists()) {
          const d = snap.data();
          setTime(d.totalTime || 0);
          setSessions(Array.isArray(d.sessions) ? d.sessions : []);
          setWeekTime(d.weekTime || 0);
          setPomodoroLoop(d.pomodoroLoop ?? true);
          setDailyGoal(d.dailyGoal || 4 * 3600);

          if (d.lastDate !== today) {
            setTodayTime(0);
          } else {
            setTodayTime(d.todayTime || 0);
          }
        } else {
          setTime(0);
          setSessions([]);
          setWeekTime(0);
          setTodayTime(0);
          setPomodoroLoop(true);
          setDailyGoal(4 * 3600);
        }
      } catch (err) {
        console.error('Failed to load data from Firestore:', err);
      } finally {
        if (!cancelled) setDataLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Always-current snapshot of state so saveData never reads stale values
  const stateRef = useRef({});
  stateRef.current = { time, todayTime, weekTime, sessions, pomodoroLoop, dailyGoal };

  const saveData = useCallback(async () => {
    if (!user || !dataLoaded) return;
    const s = stateRef.current;
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          totalTime: s.time,
          todayTime: s.todayTime,
          weekTime: s.weekTime,
          sessions: s.sessions,
          pomodoroLoop: s.pomodoroLoop,
          dailyGoal: s.dailyGoal,
          lastDate: new Date().toDateString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Failed to save data to Firestore:', err);
    }
  }, [user, dataLoaded]);

  useEffect(() => {
    if (!isRunning || !dataLoaded) return;
    const id = setInterval(saveData, 15000);
    return () => clearInterval(id);
  }, [isRunning, dataLoaded, saveData]);

  useEffect(() => {
    if (dataLoaded && !isRunning) saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  useEffect(() => {
    if (dataLoaded) saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  useEffect(() => {
    if (dataLoaded) saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyGoal]);

  useEffect(() => {
    const handler = () => saveData();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveData]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
        setTodayTime((prev) => prev + 1);
        setWeekTime((prev) => prev + 1);

        if (isPomodoroMode) {
          setPomodoroTime((prev) => {
            if (prev <= 1) {
              audioRef.current.play();
              if (pomodoroLoop) {
                setIsBreak((current) => !current);
                return isBreak ? 25 * 60 : 5 * 60;
              } else {
                setIsRunning(false);
                return 0;
              }
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isPomodoroMode, isBreak, pomodoroLoop]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setPomodoroTime(25 * 60);
  };

  const handleResetToday = () => {
    if (window.confirm("Are you sure you want to reset today's stats?")) {
      setTodayTime(0);
    }
  };

  const handleResetWeek = () => {
    if (window.confirm("Are you sure you want to reset this week's stats?")) {
      setWeekTime(0);
    }
  };

  const handleSaveSession = () => {
    const sessionTime = isPomodoroMode ? 25 * 60 - pomodoroTime : time;

    if (sessionTime <= 0 && time === 0) {
      alert('Please run the timer before saving a session!');
      return;
    }

    const newSession = {
      id: Date.now(),
      name: sessionName || `Study Session ${sessions.length + 1}`,
      subject: sessionSubject.trim(),
      duration: sessionTime > 0 ? sessionTime : time,
      timestamp: new Date().toISOString(),
    };

    setSessions([newSession, ...sessions]);
    setTime(0);
    setSessionName('');
    setSessionSubject('');
    setShowNameInput(false);
    setIsRunning(false);
    setPomodoroTime(25 * 60);
  };

  const togglePomodoroMode = () => {
    setIsPomodoroMode(!isPomodoroMode);
    if (!isPomodoroMode) {
      setPomodoroTime(25 * 60);
      setIsBreak(false);
    }
  };

  const togglePomodoroLoop = () => {
    setPomodoroLoop(!pomodoroLoop);
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const displayTime = isPomodoroMode ? formatTime(pomodoroTime) : formatTime(time);

  // Analytics derived from saved sessions
  const weeklyData = getWeeklyData(sessions);
  const streak = getStreak(sessions);
  const subjectBreakdown = getSubjectBreakdown(sessions);
  const uniqueSubjects = getUniqueSubjects(sessions);
  const goalProgress = dailyGoal > 0 ? todayTime / dailyGoal : 0;
  const goalReached = goalProgress >= 1;

  // While Firebase checks the existing session, show a simple loader
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Fullscreen focus view
  if (isFullscreen) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
            style={{ backgroundColor: 'rgba(63, 217, 239, 0.14)' }}
          />
        </div>

        {isPomodoroMode && (
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
              isBreak
                ? 'bg-chart-3/15 text-chart-3'
                : 'bg-primary/15 text-primary'
            }`}
          >
            {isBreak ? <Coffee className="size-4" /> : <Target className="size-4" />}
            {isBreak ? 'Break Time' : 'Focus Time'}
          </div>
        )}

        <motion.div
          animate={{ scale: isRunning ? [1, 1.01, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="sw-fs-panel"
        >
          <div className="sw-fs-display">
            <div className="sw-mega-glow">
              <SevenSegmentDisplay
                value={formatDeviceTime(isPomodoroMode ? pomodoroTime : time)}
                colonOn={
                  isRunning
                    ? Math.floor(isPomodoroMode ? pomodoroTime : time) % 2 === 0
                    : true
                }
                on={STOPWATCH_CYAN}
                glowColor={STOPWATCH_CYAN}
              />
            </div>
            <div className="sw-fs-reflect" aria-hidden="true">
              <SevenSegmentDisplay
                value={formatDeviceTime(isPomodoroMode ? pomodoroTime : time)}
                colonOn={
                  isRunning
                    ? Math.floor(isPomodoroMode ? pomodoroTime : time) % 2 === 0
                    : true
                }
                on={STOPWATCH_CYAN}
                off="transparent"
                glow={false}
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex items-center gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={handleStart}>
              <Play className="fill-current" /> Start
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={handlePause}>
              <Pause className="fill-current" /> Pause
            </Button>
          )}
          <Button size="lg" variant="outline" onClick={() => setIsFullscreen(false)}>
            <Minimize2 /> Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <StopwatchLogo className="size-7" />
            </div>
            <div className="min-w-0">
              <h1 className="font-brand text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                Study Stopwatch
              </h1>
              <p className="font-brand truncate text-base font-bold leading-snug text-muted-foreground">
                Stay focused. Track every minute.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {streak > 0 && (
              <div
                className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold"
                title={`${streak} day study streak`}
              >
                <Flame className="size-4 text-amber-500" />
                {streak}
              </div>
            )}
            <div
              title={user.email}
              className="flex size-9 items-center justify-center rounded-full border bg-muted text-sm font-semibold uppercase text-foreground"
            >
              {user.email?.[0] ?? 'U'}
            </div>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={<CalendarLogo className="size-6" />}
            label="Today"
            value={formatTime(todayTime)}
            accent="text-primary"
            onReset={handleResetToday}
          />
          <StatCard
            icon={<TrendingUpLogo className="size-6" />}
            label="This Week"
            value={formatDuration(weekTime)}
            accent="text-chart-2"
            onReset={handleResetWeek}
          />
        </div>

        {/* Main timer */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 py-4">
            {/* Mode segmented control */}
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                onClick={() => isPomodoroMode && togglePomodoroMode()}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !isPomodoroMode
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Timer className="size-4" /> Stopwatch
              </button>
              <button
                onClick={() => !isPomodoroMode && togglePomodoroMode()}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isPomodoroMode
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Target className="size-4" /> Pomodoro
              </button>
            </div>

            {/* Pomodoro status */}
            <AnimatePresence>
              {isPomodoroMode && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    isBreak
                      ? 'bg-chart-3/15 text-chart-3'
                      : 'bg-primary/15 text-primary'
                  }`}
                >
                  {isBreak ? <Coffee className="size-3.5" /> : <Target className="size-3.5" />}
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* The chrome stopwatch is used for both Stopwatch and Pomodoro. */}
            <motion.div
              key={isPomodoroMode ? 'pomo' : 'stop'}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <StopwatchDevice
                time={isPomodoroMode ? pomodoroTime : time}
                running={isRunning}
                onToggle={isRunning ? handlePause : handleStart}
                onReset={handleReset}
                className="w-60 sm:w-64"
              />
              <div className="text-xs text-muted-foreground">
                {formatDuration(todayTime)} / {dailyGoal / 3600}h
              </div>
              <div
                className={`text-[11px] font-semibold ${
                  goalReached ? 'text-success' : 'text-primary'
                }`}
              >
                {goalReached ? '🎉 Goal reached!' : `${Math.round(goalProgress * 100)}% of goal`}
              </div>
            </motion.div>

            {/* Daily goal editor */}
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGoalSettings(!showGoalSettings)}
                className="text-muted-foreground"
              >
                <Target className="size-4" /> Daily goal: {dailyGoal / 3600}h
              </Button>
              <AnimatePresence>
                {showGoalSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-1.5 overflow-hidden"
                  >
                    {GOAL_PRESETS.map((h) => (
                      <Button
                        key={h}
                        size="sm"
                        variant={dailyGoal === h * 3600 ? 'default' : 'outline'}
                        onClick={() => setDailyGoal(h * 3600)}
                      >
                        {h}h
                      </Button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pomodoro settings */}
            {isPomodoroMode && (
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPomodoroSettings(!showPomodoroSettings)}
                  className="text-muted-foreground"
                >
                  <Settings2 className="size-4" /> Settings
                </Button>
                <AnimatePresence>
                  {showPomodoroSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 overflow-hidden text-sm"
                    >
                      <span className="text-muted-foreground">Auto loop breaks</span>
                      <Button
                        size="sm"
                        variant={pomodoroLoop ? 'success' : 'outline'}
                        onClick={togglePomodoroLoop}
                      >
                        {pomodoroLoop ? 'On' : 'Off'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Controls */}
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {!isRunning ? (
                <Button size="lg" onClick={handleStart} className="w-full">
                  <Play className="fill-current" /> Start
                </Button>
              ) : (
                <Button size="lg" variant="secondary" onClick={handlePause} className="w-full">
                  <Pause className="fill-current" /> Pause
                </Button>
              )}

              <Button size="lg" variant="outline" onClick={handleReset} className="w-full">
                <RotateCcw /> Reset
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowNameInput(!showNameInput)}
                className="w-full"
              >
                <Save /> Save
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsFullscreen(true)}
                className="w-full"
              >
                <Maximize2 /> Focus
              </Button>
            </div>

            {/* Session name + subject input */}
            <AnimatePresence>
              {showNameInput && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex w-full flex-col gap-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="Session name (e.g., Chapter 5 revision)"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveSession()}
                      autoFocus
                    />
                    <Input
                      value={sessionSubject}
                      onChange={(e) => setSessionSubject(e.target.value)}
                      placeholder="Subject (e.g., Math)"
                      list="subject-suggestions"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveSession()}
                      className="sm:max-w-[200px]"
                    />
                    <datalist id="subject-suggestions">
                      {uniqueSubjects.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    <Button onClick={handleSaveSession} className="sm:w-auto">
                      <Check /> Save
                    </Button>
                  </div>

                  {uniqueSubjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag className="size-3.5 text-muted-foreground" />
                      {uniqueSubjects.slice(0, 8).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSessionSubject(s)}
                          className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WeeklyChart data={weeklyData} />
          <SubjectBreakdown data={subjectBreakdown} />
        </div>

        {/* Sessions */}
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SparklesLogo className="size-5" />
              <h2 className="text-lg font-semibold">Study Sessions</h2>
              {sessions.length > 0 && (
                <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {sessions.length}
                </span>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Timer className="size-6" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No sessions yet. Start the timer and save your first one!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="group flex items-center gap-3 rounded-lg border bg-card/50 p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Check className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{session.name}</p>
                          {session.subject && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                              {session.subject}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-md bg-secondary px-2.5 py-1 font-mono text-sm font-semibold tabular-nums text-secondary-foreground">
                        {formatDuration(session.duration)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSession(session.id)}
                        className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          Made with <span className="text-destructive">❤</span> by Rishav
        </footer>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, onReset }) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Card className="py-0">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <div className={`flex size-10 items-center justify-center rounded-lg bg-muted ${accent}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-mono text-2xl font-bold tabular-nums">{value}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
            title={`Reset ${label}`}
          >
            <RefreshLogo className="size-5" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default App;
