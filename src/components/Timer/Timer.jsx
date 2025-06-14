import React from 'react';
import styles from './Timer.module.css';
import { SESSION_TYPES } from '../../utils/constants';

const Timer = ({ 
  timeLeft, 
  isActive, 
  isPaused, 
  sessionType, 
  currentSession,
  workDuration,
  breakDuration,
  longBreakDuration
}) => {
  // Calculate display values
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Get correct total duration based on session type and custom durations
  const getTotalDuration = () => {
    switch (sessionType) {
      case SESSION_TYPES.WORK:
        return workDuration * 60;
      case SESSION_TYPES.SHORT_BREAK:
        return breakDuration * 60;
      case SESSION_TYPES.LONG_BREAK:
        return longBreakDuration * 60;
      default:
        return workDuration * 60;
    }
  };
  
  const totalDuration = getTotalDuration();
  
  // Calculate progress correctly with custom duration
  const getProgress = () => {
    if (totalDuration === 0) return 0;
    const elapsed = totalDuration - timeLeft;
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };
  
  const progress = getProgress();
  
  // Calculate strokeDashoffset correctly
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);
  
  // Format time display
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Get session type display text
  const getSessionTypeText = () => {
    switch (sessionType) {
      case SESSION_TYPES.WORK:
        return 'Focus Time';
      case SESSION_TYPES.SHORT_BREAK:
        return 'Short Break';
      case SESSION_TYPES.LONG_BREAK:
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };
  
  // Get status text
  const getStatusText = () => {
    if (!isActive) return 'Ready to start';
    if (isPaused) return 'Paused';
    return isActive ? 'In Progress' : 'Ready';
  };

  return (
    <div 
      className={`${styles.timer} ${isActive ? styles.active : ''} ${isPaused ? styles.paused : ''}`}
      role="timer"
      aria-live="polite"
      aria-label={`${getSessionTypeText()}, ${formattedTime} remaining`}
    >
      {/* Progress Ring Container - ONLY PROGRESS INDICATOR NEEDED */}
      <div className={styles.progressContainer}>
        <div className={styles.progressRing}>
          <svg 
            className={styles.progressSvg}
            viewBox="0 0 280 280"
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="var(--color-gray-200)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              fill="none"
              stroke="var(--color-black)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={styles.progressCircle}
              transform="rotate(-90 140 140)"
              style={{
                transition: isActive ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease'
              }}
            />
          </svg>
          
          {/* Timer Content */}
          <div className={styles.timerContent}>
            {/* Session Info */}
            <div className={styles.sessionInfo}>
              <div className={styles.sessionType}>
                {getSessionTypeText()}
              </div>
              <div className={styles.sessionNumber}>
                Session {currentSession}
              </div>
            </div>
            
            {/* Time Display */}
            <div className={styles.timeDisplay}>
              <div 
                className={styles.time}
                role="timer"
                aria-label={`${minutes} minutes ${seconds} seconds`}
              >
                {formattedTime}
              </div>
            </div>
            
            {/* Status */}
            <div className={styles.status}>
              <div className={styles.statusText}>
                {getStatusText()}
              </div>
              {isActive && (
                <div className={styles.statusIndicator}>
                  <div className={styles.pulse}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* REMOVED: Progress Bar - tidak perlu karena sudah ada ring */}
      {/* Progress bar dihapus total */}
    </div>
  );
};

export default Timer;
