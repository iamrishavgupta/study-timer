import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPomodoroMode, setIsPomodoroMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [todayTime, setTodayTime] = useState(0);
  const [weekTime, setWeekTime] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroLoop, setPomodoroLoop] = useState(true);
  const [showPomodoroSettings, setShowPomodoroSettings] = useState(false);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUsgc7y2Ik3CBlou+3nn00QDFA='));

  useEffect(() => {
    const savedTime = localStorage.getItem('totalTime');
    const savedTodayTime = localStorage.getItem('todayTime');
    const savedWeekTime = localStorage.getItem('weekTime');
    const savedSessions = localStorage.getItem('sessions');
    const savedDate = localStorage.getItem('lastDate');
    const savedPomodoroLoop = localStorage.getItem('pomodoroLoop');
    
    const today = new Date().toDateString();
    
    if (savedTime) setTime(parseInt(savedTime));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedPomodoroLoop) setPomodoroLoop(savedPomodoroLoop === 'true');
    
    if (savedDate !== today) {
      localStorage.setItem('lastDate', today);
      localStorage.setItem('todayTime', '0');
      setTodayTime(0);
    } else {
      if (savedTodayTime) setTodayTime(parseInt(savedTodayTime));
    }
    
    if (savedWeekTime) setWeekTime(parseInt(savedWeekTime));
  }, []);


  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          localStorage.setItem('totalTime', newTime.toString());
          return newTime;
        });
        
        setTodayTime(prev => {
          const newToday = prev + 1;
          localStorage.setItem('todayTime', newToday.toString());
          return newToday;
        });
        
        setWeekTime(prev => {
          const newWeek = prev + 1;
          localStorage.setItem('weekTime', newWeek.toString());
          return newWeek;
        });
        
        if (isPomodoroMode) {
          setPomodoroTime(prev => {
            if (prev <= 1) {
              audioRef.current.play();
              if (pomodoroLoop) {
                setIsBreak(current => !current);
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

 
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsRunning(false);
        clearInterval(intervalRef.current);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setPomodoroTime(25 * 60);
    localStorage.setItem('totalTime', '0');
  };

  const handleResetToday = () => {
    if (window.confirm('Are you sure you want to reset today\'s stats?')) {
      setTodayTime(0);
      localStorage.setItem('todayTime', '0');
    }
  };

  const handleResetWeek = () => {
    if (window.confirm('Are you sure you want to reset this week\'s stats?')) {
      setWeekTime(0);
      localStorage.setItem('weekTime', '0');
    }
  };

  const handleSaveSession = () => {
    const sessionTime = isPomodoroMode ? (25 * 60 - pomodoroTime) : time;
    
    if (sessionTime <= 0 && time === 0) {
      alert('Please run the timer before saving a session!');
      return;
    }
    
    const newSession = {
      id: Date.now(),
      name: sessionName || `Study Session ${sessions.length + 1}`,
      duration: sessionTime > 0 ? sessionTime : time,
      timestamp: new Date().toISOString()
    };
    
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    
    setTime(0);
    setSessionName('');
    setShowNameInput(false);
    setIsRunning(false);
    setPomodoroTime(25 * 60);
    localStorage.setItem('totalTime', '0');
  };

  const togglePomodoroMode = () => {
    setIsPomodoroMode(!isPomodoroMode);
    if (!isPomodoroMode) {
      setPomodoroTime(25 * 60);
      setIsBreak(false);
    }
  };

  const togglePomodoroLoop = () => {
    const newLoop = !pomodoroLoop;
    setPomodoroLoop(newLoop);
    localStorage.setItem('pomodoroLoop', newLoop.toString());
  };

  const deleteSession = (id) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    localStorage.setItem('sessions', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#121212', fontFamily: 'var(--font-noomo)' }}>
      <AnimatePresence>
        {!isFullscreen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl"
          >
           
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="stopwatch-header">
              <div className="header-content">
                <motion.div 
                  className="logo-container"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="/tracking.png" alt="Stopwatch Logo" className="logo-image" />
                </motion.div>
                <div className="header-text">
                  <h1 className="stopwatch-title">Study Stopwatch</h1>
                  <p className="stopwatch-subtitle">
                    
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="stats-grid">
              {/* Today Card */}
              <motion.div whileHover={{ scale: 1.02 }} className="stat-card-today">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon-wrapper">
                      <img src="/study.png" alt="Study" className="stat-icon" />
                    </div>
                    <p className="stat-label">Today</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleResetToday}
                    className="reset-button"
                    title="Reset today's stats"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                  </motion.button>
                </div>
                <p className="stat-value-today">{formatTime(todayTime)}</p>
              </motion.div>
              
              {/* Week Card */}
              <motion.div whileHover={{ scale: 1.02 }} className="stat-card-week">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="stat-icon-wrapper">
                      <img src="/chart.png" alt="Chart" className="stat-icon" />
                    </div>
                    <p className="stat-label">This Week</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleResetWeek}
                    className="reset-button"
                    title="Reset week's stats"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                  </motion.button>
                </div>
                <p className="stat-value-week">{formatDuration(weekTime)}</p>
              </motion.div>
            </div>

            {/* Main Timer */}
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="timer-container">
              <div className="text-center">
                <motion.div
                  key={time}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1 }}
                  className="timer-display"
                >
                  {isPomodoroMode ? formatTime(pomodoroTime) : formatTime(time)}
                </motion.div>
                
                {isPomodoroMode && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pomodoro-status"
                  >
                    {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
                  </motion.p>
                )}
                
                {/* Mode Toggle */}
                {/* Mode Toggle */}
<div className="mode-toggle-container">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={togglePomodoroMode}
    className={isPomodoroMode ? 'mode-button-active' : 'mode-button-inactive'}
  >
    {isPomodoroMode ? (
      <>🔵 Pomodoro</>
    ) : (
      <>
        <span className="blinking-dot"></span>
        Stopwatch
      </>
    )}
  </motion.button>
  
  {isPomodoroMode && (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowPomodoroSettings(!showPomodoroSettings)}
      className="settings-button"
    >
      ⚙️ Settings
    </motion.button>
  )}
</div>


                {/* Pomodoro Settings */}
                <AnimatePresence>
                  {showPomodoroSettings && isPomodoroMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pomodoro-settings"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                        <span className="settings-label">Auto Loop:</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={togglePomodoroLoop}
                          className={pomodoroLoop ? 'toggle-button-on' : 'toggle-button-off'}
                        >
                          {pomodoroLoop ? '✓ ON' : '✗ OFF'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
                <div className="controls-grid">
                  {!isRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStart}
                      className="btn-start-new"
                    >
                      <span className="btn-icon">▶</span>
                      <span>Start</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePause}
                      className="btn-pause-new"
                    >
                      <span className="btn-icon">⏸</span>
                      <span>Pause</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="btn-reset-new"
                  >
                    <span className="btn-icon">↻</span>
                    <span>Reset</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNameInput(!showNameInput)}
                    className="btn-save-new"
                  >
                    <span className="btn-icon">💾</span>
                    <span className="hidden sm:inline">Save Session</span>
                    <span className="sm:hidden">Save</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFullscreen(true)}
                    className="btn-fullscreen-new"
                  >
                    <span className="btn-icon">⛶</span>
                    <span>Fullscreen</span>
                  </motion.button>
                </div>

                {/* Session Name Input */}
                <AnimatePresence>
                  {showNameInput && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="session-input-container"
                    >
                      <input
                        type="text"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        placeholder="Session name (e.g., DSA Practice)"
                        className="session-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveSession();
                          }
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveSession}
                        className="btn-save-session"
                      >
                        ✓ Save
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Study Sessions History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sessions-container"
            >
              <h2 className="sessions-title">📝 Study Sessions</h2>
              
              {sessions.length === 0 ? (
                <p className="sessions-empty">No sessions yet. Start studying!</p>
              ) : (
                <div className="sessions-list">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="session-item"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="session-name">✅ {session.name}</p>
                        <p className="session-timestamp">
                          {new Date(session.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
                        <span className="session-duration">{formatDuration(session.duration)}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteSession(session.id)}
                          className="btn-delete"
                        >
                          🗑
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="footer-section"
            >
              <p className="footer-text">
                Made with <span className="heart-emoji">❤️</span> by Rishav <span className="footer-name"></span>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fullscreen-container"
          >
            <div className="text-center w-full">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="fullscreen-timer"
              >
                {isPomodoroMode ? formatTime(pomodoroTime) : formatTime(time)}
              </motion.div>
              
              {isPomodoroMode && (
                <p className="fullscreen-status">
                  {isBreak ? '☕ Break Time' : '🎯 Focus Time'}
                </p>
              )}
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(false)}
                className="btn-exit-fullscreen"
              >
                Exit Fullscreen
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
