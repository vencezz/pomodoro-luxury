import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { DURATION_LIMITS, ERROR_MESSAGES, DEFAULT_DURATIONS } from '../../utils/constants';

const Settings = ({
  workDuration,
  breakDuration,
  longBreakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
  onLongBreakDurationChange,
  disabled = false
}) => {
  // Local state for inputs to prevent constant updates while typing
  const [localWorkDuration, setLocalWorkDuration] = useState(workDuration);
  const [localBreakDuration, setLocalBreakDuration] = useState(breakDuration);
  const [localLongBreakDuration, setLocalLongBreakDuration] = useState(longBreakDuration);
  const [isExpanded, setIsExpanded] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync local state with props
  useEffect(() => {
    setLocalWorkDuration(workDuration);
    setLocalBreakDuration(breakDuration);
    setLocalLongBreakDuration(longBreakDuration);
  }, [workDuration, breakDuration, longBreakDuration]);

  // Validation function
  const validateDuration = (value, type) => {
    const num = parseInt(value);
    const limits = DURATION_LIMITS[type.toUpperCase()] || DURATION_LIMITS;
    
    if (isNaN(num) || num < limits.MIN || num > limits.MAX) {
      return ERROR_MESSAGES.INVALID_DURATION
        .replace('{min}', limits.MIN)
        .replace('{max}', limits.MAX);
    }
    return null;
  };

  // Handle input changes with validation
  const handleInputChange = (value, type, setter, onChange) => {
    setter(value);
    
    const error = validateDuration(value, type);
    setErrors(prev => ({
      ...prev,
      [type]: error
    }));
    
    if (!error) {
      onChange(parseInt(value));
    }
  };

  // Handle input blur to ensure valid values
  const handleInputBlur = (value, type, setter, onChange, currentValue) => {
    const error = validateDuration(value, type);
    if (error) {
      setter(currentValue); // Reset to current valid value
      setErrors(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  // Reset settings to default values
  const handleResetSettings = () => {
    console.log('Resetting settings to default...'); // DEBUG
    
    // Update local state
    setLocalWorkDuration(DEFAULT_DURATIONS.WORK);
    setLocalBreakDuration(DEFAULT_DURATIONS.SHORT_BREAK);
    setLocalLongBreakDuration(DEFAULT_DURATIONS.LONG_BREAK);
    
    // Clear errors
    setErrors({});
    
    // Update parent state
    onWorkDurationChange(DEFAULT_DURATIONS.WORK);
    onBreakDurationChange(DEFAULT_DURATIONS.SHORT_BREAK);
    onLongBreakDurationChange(DEFAULT_DURATIONS.LONG_BREAK);
    
    // Show success feedback (optional)
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className={`${styles.settings} ${isExpanded ? styles.expanded : ''}`}>
      {/* Settings Toggle */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="settings-panel"
        disabled={disabled}
      >
        <svg
          className={`${styles.toggleIcon} ${isExpanded ? styles.rotated : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.5-3.5L19 12l3.5 3.5M4.5 8.5L1 12l3.5 3.5" />
        </svg>
        <span>Settings</span>
      </button>

      {/* Settings Panel */}
      <div
        id="settings-panel"
        className={styles.panel}
        role="region"
        aria-labelledby="settings-title"
      >
        <div className={styles.panelContent}>
          <div className={styles.titleContainer}>
            <h3 id="settings-title" className={styles.title}>
              Timer Settings
            </h3>
            
            {/* Reset Button */}
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetSettings}
              disabled={disabled}
              aria-label="Reset settings to default"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1,4 1,10 7,10" />
                <path d="M3.51,15a9,9 0 1,0,2.13-9.36L1,10" />
              </svg>
              Reset
            </button>
          </div>
          
          <div className={styles.settingsGrid}>
            {/* Work Duration */}
            <div className={styles.settingGroup}>
              <label htmlFor="work-duration" className={styles.label}>
                Focus Time
                <span className={styles.labelHint}>minutes</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="work-duration"
                  type="number"
                  min={DURATION_LIMITS.WORK.MIN}
                  max={DURATION_LIMITS.WORK.MAX}
                  value={localWorkDuration}
                  onChange={(e) => handleInputChange(
                    e.target.value,
                    'work',
                    setLocalWorkDuration,
                    onWorkDurationChange
                  )}
                  onBlur={(e) => handleInputBlur(
                    e.target.value,
                    'work',
                    setLocalWorkDuration,
                    onWorkDurationChange,
                    workDuration
                  )}
                  className={`${styles.input} ${errors.work ? styles.inputError : ''}`}
                  disabled={disabled}
                  aria-describedby={errors.work ? "work-duration-error" : undefined}
                />
                <div className={styles.inputButtons}>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.max(DURATION_LIMITS.WORK.MIN, localWorkDuration - 1),
                      'work',
                      setLocalWorkDuration,
                      onWorkDurationChange
                    )}
                    disabled={disabled || localWorkDuration <= DURATION_LIMITS.WORK.MIN}
                    aria-label="Decrease focus time"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.min(DURATION_LIMITS.WORK.MAX, localWorkDuration + 1),
                      'work',
                      setLocalWorkDuration,
                      onWorkDurationChange
                    )}
                    disabled={disabled || localWorkDuration >= DURATION_LIMITS.WORK.MAX}
                    aria-label="Increase focus time"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.work && (
                <div id="work-duration-error" className={styles.error} role="alert">
                  {errors.work}
                </div>
              )}
            </div>

            {/* Short Break Duration */}
            <div className={styles.settingGroup}>
              <label htmlFor="break-duration" className={styles.label}>
                Short Break
                <span className={styles.labelHint}>minutes</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="break-duration"
                  type="number"
                  min={DURATION_LIMITS.SHORT_BREAK.MIN}
                  max={DURATION_LIMITS.SHORT_BREAK.MAX}
                  value={localBreakDuration}
                  onChange={(e) => handleInputChange(
                    e.target.value,
                    'short_break',
                    setLocalBreakDuration,
                    onBreakDurationChange
                  )}
                  onBlur={(e) => handleInputBlur(
                    e.target.value,
                    'short_break',
                    setLocalBreakDuration,
                    onBreakDurationChange,
                    breakDuration
                  )}
                  className={`${styles.input} ${errors.short_break ? styles.inputError : ''}`}
                  disabled={disabled}
                  aria-describedby={errors.short_break ? "break-duration-error" : undefined}
                />
                <div className={styles.inputButtons}>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.max(DURATION_LIMITS.SHORT_BREAK.MIN, localBreakDuration - 1),
                      'short_break',
                      setLocalBreakDuration,
                      onBreakDurationChange
                    )}
                    disabled={disabled || localBreakDuration <= DURATION_LIMITS.SHORT_BREAK.MIN}
                    aria-label="Decrease short break time"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.min(DURATION_LIMITS.SHORT_BREAK.MAX, localBreakDuration + 1),
                      'short_break',
                      setLocalBreakDuration,
                      onBreakDurationChange
                    )}
                    disabled={disabled || localBreakDuration >= DURATION_LIMITS.SHORT_BREAK.MAX}
                    aria-label="Increase short break time"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.short_break && (
                <div id="break-duration-error" className={styles.error} role="alert">
                  {errors.short_break}
                </div>
              )}
            </div>

            {/* Long Break Duration */}
            <div className={styles.settingGroup}>
              <label htmlFor="long-break-duration" className={styles.label}>
                Long Break
                <span className={styles.labelHint}>minutes</span>
              </label>
              <div className={styles.inputGroup}>
                <input
                  id="long-break-duration"
                  type="number"
                  min={DURATION_LIMITS.LONG_BREAK.MIN}
                  max={DURATION_LIMITS.LONG_BREAK.MAX}
                  value={localLongBreakDuration}
                  onChange={(e) => handleInputChange(
                    e.target.value,
                    'long_break',
                    setLocalLongBreakDuration,
                    onLongBreakDurationChange
                  )}
                  onBlur={(e) => handleInputBlur(
                    e.target.value,
                    'long_break',
                    setLocalLongBreakDuration,
                    onLongBreakDurationChange,
                    longBreakDuration
                  )}
                  className={`${styles.input} ${errors.long_break ? styles.inputError : ''}`}
                  disabled={disabled}
                  aria-describedby={errors.long_break ? "long-break-duration-error" : undefined}
                />
                <div className={styles.inputButtons}>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.max(DURATION_LIMITS.LONG_BREAK.MIN, localLongBreakDuration - 1),
                      'long_break',
                      setLocalLongBreakDuration,
                      onLongBreakDurationChange
                    )}
                    disabled={disabled || localLongBreakDuration <= DURATION_LIMITS.LONG_BREAK.MIN}
                    aria-label="Decrease long break time"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => handleInputChange(
                      Math.min(DURATION_LIMITS.LONG_BREAK.MAX, localLongBreakDuration + 1),
                      'long_break',
                      setLocalLongBreakDuration,
                      onLongBreakDurationChange
                    )}
                    disabled={disabled || localLongBreakDuration >= DURATION_LIMITS.LONG_BREAK.MAX}
                    aria-label="Increase long break time"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.long_break && (
                <div id="long-break-duration-error" className={styles.error} role="alert">
                  {errors.long_break}
                </div>
              )}
            </div>
          </div>

          {/* Info Text */}
          <div className={styles.info}>
            <p>Long breaks occur every 4 focus sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
