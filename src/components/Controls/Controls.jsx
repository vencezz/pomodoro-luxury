import React, { useEffect, useState } from 'react';
import styles from './Controls.module.css';

const Controls = ({ 
  isActive, 
  isPaused, 
  onStart, 
  onPause, 
  onReset, 
  onSkip,
  forceUpdate
}) => {
  // Local state untuk ensure consistent rendering
  const [localIsActive, setLocalIsActive] = useState(isActive);
  const [localIsPaused, setLocalIsPaused] = useState(isPaused);

  // Sync dengan props dan force re-render
  useEffect(() => {
    setLocalIsActive(isActive);
    setLocalIsPaused(isPaused);
    console.log('Controls state updated:', { isActive, isPaused });
  }, [isActive, isPaused, forceUpdate]);

  // Enhanced button click handler
  const handleButtonClick = (action, event) => {
    console.log('Button clicked, processing...');
    
    // Immediate visual feedback
    event.preventDefault();
    
    // Remove focus immediately
    if (event.target) {
      event.target.blur();
    }
    
    // Execute action
    action();
    
    // Force focus away from any button
    setTimeout(() => {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.blur();
      }
      
      // Set focus to body for keyboard accessibility
      if (document.body) {
        document.body.focus();
      }
    }, 10);
  };

  // Get current button state (with fallback)
  const getCurrentButtonState = () => {
    // Use local state dengan fallback ke props
    const currentIsActive = localIsActive !== undefined ? localIsActive : isActive;
    const currentIsPaused = localIsPaused !== undefined ? localIsPaused : isPaused;
    
    console.log('Current button state:', { currentIsActive, currentIsPaused });
    
    return { currentIsActive, currentIsPaused };
  };

  const { currentIsActive, currentIsPaused } = getCurrentButtonState();

  return (
    <div className={styles.controls} role="group" aria-label="Timer controls">
      {/* Primary Action Button */}
      <div className={styles.primaryControls}>
        {!currentIsActive ? (
          // START BUTTON
          <button
            key="start-button"
            className={`${styles.button} ${styles.primary}`}
            onClick={(e) => handleButtonClick(onStart, e)}
            aria-label="Start timer"
            type="button"
          >
            <svg
              className={styles.icon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
            <span>Start</span>
          </button>
        ) : (
          // PAUSE/RESUME BUTTON
          currentIsPaused ? (
            // RESUME BUTTON
            <button
              key="resume-button"
              className={`${styles.button} ${styles.primary}`}
              onClick={(e) => handleButtonClick(onStart, e)}
              aria-label="Resume timer"
              type="button"
            >
              <svg
                className={styles.icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="5,3 19,12 5,21" />
              </svg>
              <span>Resume</span>
            </button>
          ) : (
            // PAUSE BUTTON
            <button
              key="pause-button"
              className={`${styles.button} ${styles.primary}`}
              onClick={(e) => handleButtonClick(onPause, e)}
              aria-label="Pause timer"
              type="button"
            >
              <svg
                className={styles.icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
              <span>Pause</span>
            </button>
          )
        )}
      </div>

      {/* Secondary Controls */}
      <div className={styles.secondaryControls}>
        <button
          key="reset-button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={(e) => handleButtonClick(onReset, e)}
          aria-label="Reset timer"
          type="button"
        >
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1,4 1,10 7,10" />
            <path d="M3.51,15a9,9 0 1,0,2.13-9.36L1,10" />
          </svg>
          <span className={styles.buttonText}>Reset</span>
        </button>

        <button
          key="skip-button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={(e) => handleButtonClick(onSkip, e)}
          aria-label="Skip to next session"
          type="button"
          disabled={!currentIsActive}
        >
          <svg
            className={styles.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="5,4 15,12 5,20" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
          <span className={styles.buttonText}>Skip</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className={styles.shortcuts} aria-label="Keyboard shortcuts">
        <div className={styles.shortcut}>
          <kbd className={styles.kbd}>Space</kbd>
          <span>{!currentIsActive ? 'Start' : currentIsPaused ? 'Resume' : 'Pause'}</span>
        </div>
        <div className={styles.shortcut}>
          <kbd className={styles.kbd}>R</kbd>
          <span>Reset</span>
        </div>
        <div className={styles.shortcut}>
          <kbd className={styles.kbd}>S</kbd>
          <span>Skip</span>
        </div>
      </div>
    </div>
  );
};

export default Controls;
